export interface InitOptions {
    autoTrackRoutes: boolean;
    endpoint: string;
}
export declare class SimpleLog {
    private apiKey;
    private endpoint;
    constructor(apiKey: string, initOpts?: InitOptions);
    trackEvent(event: string, metadata: Record<string, any>): Promise<void>;
    private setupAutoRouteTracking;
}
