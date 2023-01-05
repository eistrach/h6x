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
            q: 0,
            r: 0,
          },
          {
            q: 1,
            r: 0,
          },
          {
            q: 2,
            r: 0,
          },
          {
            q: 3,
            r: 0,
          },
          {
            q: 0,
            r: 1,
          },
          {
            q: 0,
            r: 2,
          },
          {
            q: 0,
            r: 3,
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
