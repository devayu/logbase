"use client";
import { useSimpleLogTracker } from "simple-log-sdk";

export default function Home() {
  const tracker = useSimpleLogTracker();
  return (
    <div>
      <button
        onClick={() => tracker.trackEvent("test", { testing: "metadata" })}
      >
        test
      </button>
    </div>
  );
}
