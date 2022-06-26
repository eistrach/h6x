import { User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createOrUpdateUser(user: Omit<User, "id">) {
  return prisma.user.upsert({
    where: { email: user.email },
    create: user,
    update: user,
  });
}

export async function deleteUserByEmail(email: string) {
  return prisma.user.delete({ where: { email } });
}
