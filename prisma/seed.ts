import bcrypt from "@node-rs/bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "12345678";

async function seed() {
  const existingAdmin = await prisma.user.count({
    where: { email: ADMIN_EMAIL },
  });
  if (existingAdmin) {
    console.log("Database was already seeded");
    return;
  }

  const admin = await seedAdmin();
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  return await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      name: "admin",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}
