import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newPackingData = await prisma.packingData.create({
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
  return { success: true, data: newPackingData };
});
