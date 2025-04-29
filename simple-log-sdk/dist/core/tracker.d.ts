import type { InitOptions } from "./types";
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
export declare class SimpleLogTracker {
    private static instance;
    private apiKey;
    private endpoint;
    private canAutoTrackEvents;
    private isAutoTrackingInitialized;
    private cleanupFn;
    private lastTrackedPath;
    private lastTrackedTime;
    private deduplicationInterval;
    /**
     * Private constructor to prevent direct instantiation.
     * Restores state from window if available.
     * @private
     */
    private constructor();
    /**
     * Gets the singleton instance of SimpleLogTracker.
     * Creates a new instance if one doesn't exist.
     * @returns {SimpleLogTracker} The singleton instance
     * @static
     */
    static getInstance(): SimpleLogTracker;
    /**
     * Initializes the tracker with the provided API key and options.
     * @param {string} apiKey - The API key for authentication
     * @param {InitOptions} [initOpts] - Optional initialization options
     * @returns {void}
     */
    init(apiKey: string, initOpts?: InitOptions): void;
    /**
     * Verifies the API key with the tracking server.
     * Sets the canAutoTrackEvents flag based on the server response.
     * @returns {Promise<void>}
     */
    verifyApiKey(): Promise<void>;
    /**
     * Tracks a custom event with the provided type and metadata.
     * Implements deduplication logic for route tracking events.
     * @param {string} type - The type of event to track
     * @param {Record<string, any>} metadata - Additional data for the event
     * @returns {Promise<void>}
     */
    trackEvent(type: string, metadata: Record<string, any>): Promise<void>;
    /**
     * Sets up automatic route tracking based on the provided router type.
     * Supports Next.js Router, React Router, and vanilla JavaScript history API.
     * @param {NextRouter | ReactRouter} [router] - The router instance
     * @param {string} [routeTrackingKey] - Custom key for route tracking events
     * @returns {() => void} Cleanup function to remove event listeners
     * @private
     */
    private setupAutoRouteTracking;
    /**
     * Cleans up the tracker instance by removing event listeners and resetting state.
     * Should be called when the tracker is no longer needed.
     * @returns {void}
     */
    destroy(): void;
    /**
     * Generates the tracking key for route change events.
     * Uses custom key if provided, otherwise generates based on navigation type.
     * @param {string} [routeTrackingKey] - Custom tracking key
     * @returns {string} The final tracking key to use
     * @private
     */
    private getRouteTrackingKey;
}
