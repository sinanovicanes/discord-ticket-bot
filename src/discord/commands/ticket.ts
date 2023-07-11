import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "@/api";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";
import { TICKET_CHANNEL_ID } from "@/config";

const name = "ticket";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Creates a new support ticket")
  .addStringOption(option =>
    option.setName("title").setDescription("Title of your problem").setRequired(true)
  );

const command = new Command({
  name,
  command: commandBuild as SlashCommandBuilder,
  execute: async (
    interaction: CommandInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    if (!interaction.channelId) return;

    const ticketChannel = client.channels.cache.get(TICKET_CHANNEL_ID);
    if (!ticketChannel || ticketChannel.type != ChannelType.GuildText) return;

    const thread = await ticketChannel.threads.create({
      type: ChannelType.PrivateThread,
      name: `support-${Date.now()}`,
      reason: `Support Ticket ${Date.now()}`
    });
    const description = interaction.options.data.find(d => d.name === "title")!.value;
    const { user } = interaction;

    const ticket = await prisma.tickets.create({
      data: {
        threadId: thread.id,
        userId: user.id,
        description: description!.toString()
      }
    });

    if (!ticket) {
      thread.delete();
      return interaction.reply({
        content: "An error occured while creating ticket. Try again later.",
        ephemeral: true
      });
    }

    thread.members.add(user.id);
    thread.setName(`ticket-${ticket.id}`, `Ticket ${ticket.id}`);
    thread.send(`**User:** ${user} **Problem:** ${description}`);

    return interaction.reply({
      content: "Support ticket created",
      ephemeral: true
    });
  }
});

export default command;
