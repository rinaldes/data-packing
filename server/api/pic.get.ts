import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const data = await prisma.pic.findMany();
  return { success: true, data };
});
