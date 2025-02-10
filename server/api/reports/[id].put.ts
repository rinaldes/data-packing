import { defineEventHandler, readBody, sendError } from "h3";
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

  const body = await readBody(event);

  const { datetime, pic, weight, qtyA, qtyB, qtyC, reject } = body;

  if (
    !datetime ||
    !pic ||
    weight === undefined ||
    qtyA === undefined ||
    qtyB === undefined ||
    qtyC === undefined ||
    reject === undefined
  ) {
    return sendError(
      event,
      createError({ statusCode: 400, message: "Missing required fields." })
    );
  }

  try {
    const updatedReport = await prisma.packingData.update({
      where: { id: reportId },
      data: {
        datetime: new Date(body.datetime),
        pic: body.pic,
        weight: parseFloat(body.weight),
        qtyA: parseInt(body.qtyA, 10),
        qtyB: parseInt(body.qtyB, 10),
        qtyC: parseInt(body.qtyC, 10),
        reject: parseFloat(body.reject),
      },
    });

    return updatedReport;
  } catch (error) {
    return sendError(
      event,
      createError({ statusCode: 500, message: "Failed to update report." })
    );
  }
});
