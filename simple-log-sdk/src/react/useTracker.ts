import { useContext } from "react";
import { TrackerContext } from "./TrackerProvider";

export const useTracker = () => {
  const context = useContext(TrackerContext);

  if (!context)
    throw new Error("useTracker must be used within TrackerProvider");
  return context;
};
