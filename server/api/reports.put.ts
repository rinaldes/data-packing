import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, datetime, pic, weight, qtyA, qtyB, qtyC, reject } = body;

  try {
    const updatedReport = await prisma.packingData.update({
      where: { id },
      data: {
        datetime: new Date(datetime),
        pic,
        weight,
        qtyA,
        qtyB,
        qtyC,
        reject,
      },
    });
    return { success: true, data: updatedReport };
  } catch (error) {
    return { success: false, error: "Failed to update report" };
  }
});
