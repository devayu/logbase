import { prisma } from "@/db/db";
import { verifySignature } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const signature = req.headers.get("upstash-signature") || "";

  const isValid = await verifySignature({
    signature,
    body: await req.text(),
    currentDate: new Date().toISOString(),
  });

  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queryParams = new URL(req.url).searchParams;
  const projectId = queryParams.get("id");
  if (!projectId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const monitoredProjects = await prisma.project.findMany({
      where: {
        monitoringEnabled: true,
        id: Number(projectId),
      },
    });

    console.log(monitoredProjects);
    // Check each project's endpoint
    for (const project of monitoredProjects) {
      const startTime = Date.now();
      try {
        if (!project.monitoringUrl) continue;
        console.log("Checking endpoint:", project.monitoringUrl);
        const response = await fetch(project.monitoringUrl);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const uptimeLog = await prisma.uptimeLog.create({
          data: {
            projectId: project.id,
            responseTime,
            isOffline: !response.ok,
            checkedAt: new Date(),
          },
        });
        console.log("uptimeLog", uptimeLog);
        if (!uptimeLog)
          return NextResponse.json({
            success: false,
            message: "Uptime | Log not generated",
          });
        return NextResponse.json({
          success: true,
          message: "Uptime | Log generated",
        });
      } catch (error) {
        await prisma.uptimeLog.create({
          data: {
            projectId: project.id,
            responseTime: 0,
            isOffline: true,
            checkedAt: new Date(),
          },
        });
        return NextResponse.json({
          success: false,
          message: `Uptime | Failed - ${error}`,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Monitoring check failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
