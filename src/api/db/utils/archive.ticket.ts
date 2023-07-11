import { prisma } from "@/api";

export function archiveTicket(ticketId: string) {
  prisma.tickets
    .updateMany({
      where: { id: ticketId },
      data: {
        archived: new Date()
      }
    })
    .then(() => console.log(`${ticketId} archived`));
}

export default archiveTicket;
