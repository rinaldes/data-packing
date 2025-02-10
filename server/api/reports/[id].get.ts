import { defineEventHandler, sendError } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Get the report ID from the URL
  const reportId = event.context.params?.id;

  if (!reportId) {
    return sendError(
      event,
      createError({ statusCode: 400, message: "Report ID is required." })
    );
  }

  try {
    // Fetch the report from the database using Prisma
    const report = await prisma.packingData.findUnique({
      where: { id: reportId },
    });

    // If the report doesn't exist
    if (!report) {
      return sendError(
        event,
        createError({ statusCode: 404, message: "Report not found." })
      );
    }

    // Return the fetched report data
    return report;
  } catch (error) {
    // Handle errors (e.g., database issues)
    console.error(error);
    return sendError(
      event,
      createError({ statusCode: 500, message: "Failed to fetch report." })
    );
  }
});
