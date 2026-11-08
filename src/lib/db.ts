import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("缺少 DATABASE_URL（见 .env.example）");
}

const isServerless = Boolean(process.env.VERCEL);
const max = isServerless ? 1 : 8;

const globalFor = globalThis as unknown as { prisma: PrismaClient; pool: Pool };

const pool = globalFor.pool ?? new Pool({ connectionString: url, max });
if (process.env.NODE_ENV !== "production") {
  globalFor.pool = pool;
}

const adapter = new PrismaPg(pool);
export const prisma = globalFor.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalFor.prisma = prisma;
}
