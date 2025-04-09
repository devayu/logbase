import React from "react";
import { InitOptions, SimpleLogTracker } from "../core/tracker";
type TrackerContextType = SimpleLogTracker | null;
export declare const TrackerContext: React.Context<TrackerContextType>;
type TrackerProviderProps = {
    apiKey: string;
    initOpts?: InitOptions;
    children: React.ReactNode;
};
export declare const TrackerProvider: ({ apiKey, initOpts, children, }: TrackerProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
