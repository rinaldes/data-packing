import { defineEventHandler, sendError } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const reportId = event.context.params?.id;

  if (!reportId) {
    return sendError(
      event,
      createError({ statusCode: 400, message: "Report ID is required." })
    );
  }

  try {
    const report = await prisma.packingData.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return sendError(
        event,
        createError({ statusCode: 404, message: "Report not found." })
      );
    }

    return report;
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, message: "Failed to fetch report." })
    );
  }
});
