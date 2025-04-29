import { corsHeaders, handleOptions } from "@/lib/cors";
import { prisma } from "@/db/db";
import { getDeviceType } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
export async function POST(req: NextRequest) {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) return optionsResponse;
  try {
    const authHeader = req.headers.get("authorization");
    const projectKey = authHeader?.split(" ")[1];

    if (!projectKey) {
      return NextResponse.json(
        { message: "Invalid request" },
        {
          status: 400,
          headers: corsHeaders(req),
        }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        apiKey: projectKey,
      },
      select: {
        id: true,
        plan: true,
        status: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "No project found with given API key" },
        {
          status: 404,
          headers: corsHeaders(req),
        }
      );
    }

    if (project.status === "PAUSED") {
      return NextResponse.json(
        { message: "Project is paused. Tracking is disabled" },
        {
          status: 403,
          headers: corsHeaders(req),
        }
      );
    }
    const { type, userAgent, url, metadata } = await req.json();
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0].trim()
        : req.headers.get("x-real-ip") || "";
    const cleanIP = ip?.replace(/^::ffff:/, "");

    const geo = await fetch(
      `https://ipinfo.io/${cleanIP}?token=${process.env.IP_INFO_API_KEY}`
    );
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data = (await geo.json()) as Record<string, any>;
    const deviceType = getDeviceType(userAgent);
    const updatedMetadata = {
      ...metadata,
      city: data.city,
      region: data.region,
      country: data.country,
      ipAddress: ip,
      path: url,
      source: deviceType, // web, mobile, tablet, desktop,
    };
    const event = await prisma.event.create({
      data: {
        projectId: project.id,
        type,
        metadata: updatedMetadata,
      },
    });
    return NextResponse.json(event, {
      status: 200,
      headers: corsHeaders(req),
    });
  } catch (error) {
    console.error("Error verifying project key:", error);
    return NextResponse.json(
      { message: "Server error while verifying API key" },
      {
        status: 500,
        headers: corsHeaders(req),
      }
    );
  }
}
