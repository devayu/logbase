type InitOptionsWithAutoTrack = {
  autoTrackRoutes: true;
  endpoint?: string;
  router: NextRouter | ReactRouter;
};
type InitOptionsWithoutAutoTrack = {
  autoTrackRoutes: false;
  endpoint?: string;
};

export type InitOptions =
  | InitOptionsWithAutoTrack
  | InitOptionsWithoutAutoTrack;

type NextRouter = {
  events: {
    on: (event: string, cb: (url: string) => void) => void;
    off: (event: string, cb: (url: string) => void) => void;
  };
};

type ReactRouter = {
  listen: (cb: (location: { pathname: string }) => void) => () => void;
};

declare global {
  interface Window {
    __simpleLogInstance?: SimpleLogTracker;
  }
}
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
  private constructor() {
    // Restore state from window if available
    if (typeof window !== "undefined" && window.__simpleLogInstance) {
      const cached = window.__simpleLogInstance;
      this.apiKey = cached.apiKey;
      this.endpoint = cached.endpoint;
      this.canAutoTrackEvents = cached.canAutoTrackEvents;
      this.isAutoTrackingInitialized = cached.isAutoTrackingInitialized;
    }
  }

  public static getInstance(): SimpleLogTracker {
    if (typeof window === "undefined") {
      console.error("SimpleLogTracker must be used in the browser");
    }

    // Check if already stored on window
    if (window.__simpleLogInstance) {
      return window.__simpleLogInstance;
    }

    // Check module cache
    if (!this.instance) {
      this.instance = new SimpleLogTracker();
      window.__simpleLogInstance = this.instance;
    }

    return this.instance;
  }

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
        this.cleanupFn = this.setupAutoRouteTracking(initOpts.router);
        this.isAutoTrackingInitialized = true;
      }
    });
  }

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

  private setupAutoRouteTracking(
    router?: NextRouter | ReactRouter
  ): () => void {
    let eventName = "changed";
    const navType = (
      performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming
    ).type;
    if (navType) {
      eventName = navType;
    }
    const track = (path: string) => {
      this.trackEvent(`route_${eventName}`, {
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
}
