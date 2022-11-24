import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  const admin = await seedAdmin();
  await seedMap(admin);

  console.log(`Database has been seeded. 🌱`);
};

const seedAdmin = async () => {
  return prisma.user.create({
    data: {
      nickname: "Admin",
    },
  });
};

const seedMap = async (admin: User) => {
  return await prisma.hexMap.create({
    data: {
      name: "Example",
      published: true,
      creatorId: admin.id,
      tiles: {
        create: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 1,
            y: 0,
          },
          {
            x: 2,
            y: 0,
          },
          {
            x: 3,
            y: 0,
          },
          {
            x: 0,
            y: 1,
          },
          {
            x: 0,
            y: 2,
          },
          {
            x: 0,
            y: 3,
          },
        ],
      },
    },
  });
};

try {
  seed();
} catch (e) {
  console.error(e);
} finally {
  prisma.$disconnect();
}
