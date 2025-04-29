import { prisma } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  // Handle preflight
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

    return NextResponse.json(
      {
        projectPlan: project.plan,
        canAutoTrackEvents: project.plan === "PREMIUM",
      },
      {
        status: 200,
        headers: corsHeaders(req),
      }
    );
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
