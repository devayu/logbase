type InitOptionsWithAutoTrack = {
    autoTrackRoutes: true;
    endpoint?: string;
    router: NextRouter | ReactRouter;
};
type InitOptionsWithoutAutoTrack = {
    autoTrackRoutes: false;
    endpoint?: string;
};
export type InitOptions = InitOptionsWithAutoTrack | InitOptionsWithoutAutoTrack;
type NextRouter = {
    events: {
        on: (event: string, cb: (url: string) => void) => void;
        off: (event: string, cb: (url: string) => void) => void;
    };
};
type ReactRouter = {
    listen: (cb: (location: {
        pathname: string;
    }) => void) => () => void;
};
declare global {
    interface Window {
        __simpleLogInstance?: SimpleLogTracker;
    }
    var __simpleLogInstance: SimpleLogTracker | undefined;
}
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
    private constructor();
    static getInstance2(): SimpleLogTracker;
    static getInstance(): SimpleLogTracker;
    init(apiKey: string, initOpts?: InitOptions): void;
    verifyApiKey(): Promise<void>;
    trackEvent(event: string, metadata: Record<string, any>): Promise<void>;
    private setupAutoRouteTracking;
    destroy(): void;
}
export {};
