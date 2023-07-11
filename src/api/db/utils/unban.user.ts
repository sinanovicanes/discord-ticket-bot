import { prisma } from "@/api";

export function ubanUser(userId: string) {
  prisma.bannedUsers
    .delete({
      where: {
        id: userId
      }
    })
    .then(() => console.log(`${userId} unbanned`));
}

export default ubanUser;
