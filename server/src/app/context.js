import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import db from "./db.js";

export const context = {
  db,
  prisma: prisma,
};
