/**
 * Configuration options for initializing the tracker with automatic route tracking enabled.
 */
export type InitOptionsWithAutoTrack = {
    /** Enable automatic route tracking. Must be set to true for this option type */
    autoTrackRoutes: true;
    /** Custom endpoint URL for the tracking server. Defaults to localhost if not provided */
    endpoint?: string;
    /** Optional key for route tracking events. If not provided, defaults to "route_changed" or navigation type based key */
    routeTrackingKey?: string;
    /** Router instance - either Next.js Router or React Router instance */
    router: NextRouter | ReactRouter;
};
/**
 * Configuration options for initializing the tracker without automatic route tracking.
 */
export type InitOptionsWithoutAutoTrack = {
    /** Disable automatic route tracking. Must be set to false for this option type */
    autoTrackRoutes: false;
    /** Custom endpoint URL for the tracking server. Defaults to localhost if not provided */
    endpoint?: string;
};
/**
 * Union type for initialization options.
 */
export type InitOptions = InitOptionsWithAutoTrack | InitOptionsWithoutAutoTrack;
/**
 * Type definition for Next.js Router interface.
 */
export type NextRouter = {
    events: {
        /** Register an event listener for route changes */
        on: (event: string, cb: (url: string) => void) => void;
        /** Remove an event listener for route changes */
        off: (event: string, cb: (url: string) => void) => void;
    };
};
/**
 * Type definition for React Router interface.
 */
export type ReactRouter = {
    /** Register a listener for location changes */
    listen: (cb: (location: {
        pathname: string;
    }) => void) => () => void;
};
