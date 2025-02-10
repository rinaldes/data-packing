import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  try {
    const deletedReport = await prisma.packingData.delete({
      where: { id },
    });

    if (!deletedReport) {
      return sendError(
        event,
        createError({ statusCode: 404, message: "Report not found" })
      );
    }

    return { success: true }; // Ensure success response is sent
  } catch (error) {
    console.error("Error deleting report:", error);
    return sendError(
      event,
      createError({ statusCode: 500, message: "Failed to delete report" })
    );
  }
});
