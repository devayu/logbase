import { prisma } from "@/db/db";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export const POST = verifySignatureAppRouter(async (req: Request) => {
  const queryParams = new URL(req.url).searchParams;
  const projectId = queryParams.get("id");
  if (!projectId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const monitoredProjects = await prisma.project.findMany({
    where: {
      monitoringEnabled: true,
      id: Number(projectId),
    },
  });

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

      if (!uptimeLog)
        return NextResponse.json({
          success: false,
          message: "Uptime | Log not generated",
        });
      revalidatePath(`/dashboard/${projectId}/monitoring`);
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
});

export const config = {
  api: {
    bodyParser: false,
  },
};
