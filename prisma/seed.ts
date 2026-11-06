import "dotenv/config";
import { hash } from "bcryptjs";

import { prisma } from "../src/lib/db";

async function main() {
  const passwordHash = await hash("demo1234", 10);
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    create: {
      email: "demo@example.com",
      passwordHash,
      displayName: "智诊体验用户",
    },
    update: {
      passwordHash,
      displayName: "智诊体验用户",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
