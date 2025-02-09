import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newPIC = await prisma.pic.create({
    data: {
      name: body.name,
    },
  });
  return { success: true, data: newPIC };
});
