import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newPackingData = await prisma.packingData.create({
    data: {
      datetime: new Date(body.datetime),
      pic: body.pic,
      weight: body.weight,
      qtyA: body.qtyA,
      qtyB: body.qtyB,
      qtyC: body.qtyC,
      reject: body.reject,
    },
  });
  return { success: true, data: newPackingData };
});
