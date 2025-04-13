// In a real app, this would interact with a backend API
// Currently using mock data for demo purposes

export interface Event {
  id: string;
  type: string;
  source: string;
  path: string;
  timestamp: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  properties: Record<string, any>;
}

// Mock function to get events
export const getEvents = async (): Promise<Event[]> => {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const events = [
        {
          id: "evt_1",
          type: "page_view",
          source: "web",
          path: "/products",
          timestamp: "2025-04-10T10:30:00Z",
          properties: { referrer: "google.com" },
        },
        {
          id: "evt_2",
          type: "click",
          source: "web",
          path: "/products/123",
          timestamp: "2025-04-10T10:32:15Z",
          properties: { element: "add_to_cart_button" },
        },
        // More events...
      ];
      resolve(events);
    }, 500);
  });
};

// Mock function to track a new event
export const trackEvent = async (
  type: string,
  properties: Record<string, any>
): Promise<Event> => {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent = {
        id: `evt_${Math.random().toString(36).substring(2, 9)}`,
        type,
        source: "sdk",
        path: properties.path || "/",
        timestamp: new Date().toISOString(),
        properties,
      };
      console.log("Event tracked:", newEvent);
      resolve(newEvent);
    }, 300);
  });
};
