"use client";

import React, { createContext, useEffect, useRef, useState } from "react";
import { InitOptions, SimpleLogTracker } from "../core/tracker";

type TrackerContextType = SimpleLogTracker | null;

export const TrackerContext = createContext<TrackerContextType>(null);

type TrackerProviderProps = {
  apiKey: string;
  initOpts?: InitOptions;
  children: React.ReactNode;
};

export const TrackerProvider = ({
  apiKey,
  initOpts,
  children,
}: TrackerProviderProps) => {
  const [tracker] = useState(() => SimpleLogTracker.getInstance());

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      tracker.init(apiKey, initOpts);
      hasInitialized.current = true;
    }
  }, [apiKey, tracker]);

  return (
    <TrackerContext.Provider value={tracker}>
      {children}
    </TrackerContext.Provider>
  );
};
