import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    const deletePic = await prisma.pic.delete({
      where: { id },
    });

    if (!deletePic) {
      return sendError(
        event,
        createError({ statusCode: 404, message: "Report not found" })
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return sendError(
      event,
      createError({ statusCode: 500, message: "Failed to delete report" })
    );
  }
});
