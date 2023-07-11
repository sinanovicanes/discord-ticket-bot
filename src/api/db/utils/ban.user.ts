import { prisma } from "@/api";

export function banUser(userId: string, bannedUntil: Date) {
  prisma.bannedUsers
    .create({
      data: {
        id: userId,
        bannedUntil
      }
    })
    .then(() => console.log(`${userId} banned until ${bannedUntil.toDateString()}`));
}

export default banUser;
