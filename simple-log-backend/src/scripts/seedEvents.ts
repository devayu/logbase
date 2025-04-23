import { db } from "../db";
import { eventsTable, projectsTable } from "../db/schema";

const eventTypes = [
  {
    name: "page_view",
    metadataTemplates: [
      {
        url: "/dashboard",
        referrer: "https://google.com",
        device: "desktop",
        browser: "Chrome",
        os: "MacOS",
      },
      {
        url: "/settings",
        referrer: "https://github.com",
        device: "mobile",
        browser: "Safari",
        os: "iOS",
      },
    ],
  },
  {
    name: "button_click",
    metadataTemplates: [
      {
        buttonId: "submit-form",
        buttonText: "Submit",
        pageSection: "checkout",
      },
      {
        buttonId: "signup",
        buttonText: "Sign Up Now",
        pageSection: "hero",
      },
    ],
  },
  {
    name: "form_submit",
    metadataTemplates: [
      {
        formId: "contact",
        success: true,
        timeToComplete: 45,
      },
      {
        formId: "registration",
        success: false,
        error: "Invalid email format",
      },
    ],
  },
];

const locations = [
  { city: "New York", region: "NY", country: "US", ipAddress: "192.168.1.1" },
  {
    city: "London",
    region: "England",
    country: "GB",
    ipAddress: "192.168.1.2",
  },
  { city: "Tokyo", region: "Tokyo", country: "JP", ipAddress: "192.168.1.3" },
  { city: "Sydney", region: "NSW", country: "AU", ipAddress: "192.168.1.4" },
];

async function seedEvents(seedLimit: number = 100) {
  try {
    // Get first project from database
    const project = await db.select().from(projectsTable).limit(1);

    if (!project.length) {
      console.error("No projects found. Please seed projects first.");
      process.exit(1);
    }

    const projectId = project[0].id;
    console.log("Starting Seeding with project id: ", projectId);
    const now = new Date();

    // Generate events for the last 7 days
    for (let i = 0; i < seedLimit; i++) {
      const randomEvent =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomLocation =
        locations[Math.floor(Math.random() * locations.length)];
      const randomTemplate =
        randomEvent.metadataTemplates[
          Math.floor(Math.random() * randomEvent.metadataTemplates.length)
        ];

      // Random date within last 7 days
      const randomDate = new Date(
        now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
      );
      await db.insert(eventsTable).values({
        event: randomEvent.name,
        project_id: projectId,
        metadata: {
          ...randomTemplate,
          ...randomLocation,
        },
        timestamp: randomDate,
      });
    }

    console.log(`✅ Successfully seeded ${seedLimit} events`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
}

seedEvents(50);
