import type { InitOptions, NextRouter, ReactRouter } from "./types";

/**
 * Global window interface extension to store SimpleLogTracker instance.
 */
declare global {
  interface Window {
    /** Global instance of SimpleLogTracker */
    __simpleLogInstance?: SimpleLogTracker;
  }
}
/**
 * SimpleLogTracker class for tracking user events and route changes in web applications.
 * Implements the Singleton pattern to ensure only one instance exists globally.
 * @class
 */
export class SimpleLogTracker {
  private static instance: SimpleLogTracker | null = null;

  private apiKey!: string;
  private endpoint!: string;
  private canAutoTrackEvents: boolean = false;
  private isAutoTrackingInitialized = false;
  private cleanupFn: (() => void) | null = null;
  private lastTrackedPath: string | null = null;
  private lastTrackedTime: number = 0;
  private deduplicationInterval: number = 2000; // 2 seconds

  // private constructor() {}
  /**
   * Private constructor to prevent direct instantiation.
   * Restores state from window if available.
   * @private
   */
  private constructor() {
    if (typeof window !== "undefined" && window.__simpleLogInstance) {
      const cached = window.__simpleLogInstance;
      this.apiKey = cached.apiKey;
      this.endpoint = cached.endpoint;
      this.canAutoTrackEvents = cached.canAutoTrackEvents;
      this.isAutoTrackingInitialized = cached.isAutoTrackingInitialized;
    }
  }

  /**
   * Gets the singleton instance of SimpleLogTracker.
   * Creates a new instance if one doesn't exist.
   * @returns {SimpleLogTracker} The singleton instance
   * @static
   */
  public static getInstance(): SimpleLogTracker {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== "undefined";

    if (!isBrowser) {
      // Create a new instance for server-side without storing it
      return new SimpleLogTracker();
    }

    // Browser-side singleton logic
    if (window.__simpleLogInstance) {
      return window.__simpleLogInstance;
    }

    if (!this.instance) {
      this.instance = new SimpleLogTracker();
      window.__simpleLogInstance = this.instance;
    }

    return this.instance;
  }

  /**
   * Initializes the tracker with the provided API key and options.
   * @param {string} apiKey - The API key for authentication
   * @param {InitOptions} [initOpts] - Optional initialization options
   * @returns {void}
   */
  public init(apiKey: string, initOpts?: InitOptions) {
    if (this.apiKey) return; // already initialized
    this.apiKey = apiKey;
    this.endpoint = initOpts?.endpoint || "http://localhost:3090";
    this.verifyApiKey().then(() => {
      if (initOpts?.autoTrackRoutes && !this.canAutoTrackEvents) {
        console.info(
          "[SimpleLog SDK] Seems like you are on Basic plan, upgrade to Premium plan to auto track events"
        );
      }
      if (
        initOpts?.autoTrackRoutes &&
        this.canAutoTrackEvents &&
        !this.isAutoTrackingInitialized
      ) {
        this.cleanupFn = this.setupAutoRouteTracking(
          initOpts.router,
          initOpts.routeTrackingKey
        );
        this.isAutoTrackingInitialized = true;
      }
    });
  }

  /**
   * Verifies the API key with the tracking server.
   * Sets the canAutoTrackEvents flag based on the server response.
   * @returns {Promise<void>}
   */
  public async verifyApiKey() {
    try {
      const verifyRes = await fetch(`${this.endpoint}/api/verifyProjectKey`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const res = await verifyRes.json();
      this.canAutoTrackEvents = res.canAutoTrackEvents;
    } catch (err) {
      console.error("[SimpleLog SDK] Failed to verify api key", err);
    }
  }

  /**
   * Tracks a custom event with the provided type and metadata.
   * Implements deduplication logic for route tracking events.
   * @param {string} type - The type of event to track
   * @param {Record<string, any>} metadata - Additional data for the event
   * @returns {Promise<void>}
   */
  public async trackEvent(type: string, metadata: Record<string, any>) {
    if (!this.apiKey) {
      console.warn("[SimpleLog SDK] You must call init() first.");
      return;
    }
    const now = Date.now();

    if (
      metadata?.path === this.lastTrackedPath &&
      now - this.lastTrackedTime < this.deduplicationInterval
    ) {
      return;
    }

    this.lastTrackedPath = metadata?.path;
    this.lastTrackedTime = now;

    const isClient =
      typeof window !== "undefined" && typeof navigator !== "undefined";
    const body = {
      type,
      metadata: metadata,
      timestamp: new Date().toISOString(),
      url: isClient ? window?.location.pathname : undefined,
      userAgent: isClient ? navigator.userAgent : undefined,
    };

    try {
      await fetch(`${this.endpoint}/api/trackEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("[SimpleLog SDK] Failed to track event", err);
    }
  }

  /**
   * Sets up automatic route tracking based on the provided router type.
   * Supports Next.js Router, React Router, and vanilla JavaScript history API.
   * @param {NextRouter | ReactRouter} [router] - The router instance
   * @param {string} [routeTrackingKey] - Custom key for route tracking events
   * @returns {() => void} Cleanup function to remove event listeners
   * @private
   */
  private setupAutoRouteTracking(
    router?: NextRouter | ReactRouter,
    routeTrackingKey?: string
  ): () => void {
    const track = (path: string) => {
      this.trackEvent(this.getRouteTrackingKey(routeTrackingKey), {
        path,
        timestamp: new Date().toISOString(),
      });
    };

    // ✅ Next.js Router
    if (router && "events" in router) {
      const handler = (url: string) => track(url);
      router.events.on("routeChangeComplete", handler);

      return () => {
        router.events.off("routeChangeComplete", handler);
      };
    }

    // ✅ React Router
    if (router && "listen" in router) {
      const unlisten = router.listen((location) => {
        track(location.pathname);
      });
      return unlisten;
    }

    if (typeof window === "undefined") return () => {};

    // ✅ Vanilla
    const trackIfChanged = () => {
      track(window.location.pathname);
    };

    const patchHistoryMethod = (type: "pushState" | "replaceState") => {
      const original = history[type];
      history[type] = function (...args) {
        const result = original.apply(this, args);
        window.dispatchEvent(new Event(type));
        return result;
      };
    };

    patchHistoryMethod("pushState");
    patchHistoryMethod("replaceState");

    window.addEventListener("popstate", trackIfChanged);
    window.addEventListener("pushState", trackIfChanged);
    window.addEventListener("replaceState", trackIfChanged);

    trackIfChanged(); // Initial call

    return () => {
      window.removeEventListener("popstate", trackIfChanged);
      window.removeEventListener("pushState", trackIfChanged);
      window.removeEventListener("replaceState", trackIfChanged);
    };
  }

  /**
   * Cleans up the tracker instance by removing event listeners and resetting state.
   * Should be called when the tracker is no longer needed.
   * @returns {void}
   */
  public destroy() {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
    this.apiKey = "";
    this.endpoint = "";
    this.isAutoTrackingInitialized = false;
    this.lastTrackedPath = "";
  }

  /**
   * Generates the tracking key for route change events.
   * Uses custom key if provided, otherwise generates based on navigation type.
   * @param {string} [routeTrackingKey] - Custom tracking key
   * @returns {string} The final tracking key to use
   * @private
   */
  private getRouteTrackingKey(routeTrackingKey?: string) {
    let trackingKey = "route_changed";
    if (routeTrackingKey) {
      trackingKey = routeTrackingKey;
    } else {
      const navType = (
        performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming
      ).type;
      if (navType) {
        trackingKey = `route_${navType}`;
      }
    }
    return trackingKey;
  }
}
