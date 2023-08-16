import {
  ChannelType,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  EmbedType,
  SlashCommandBuilder
} from "discord.js";
import { prisma } from "@/api";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";
import { TICKET_CHANNEL_ID } from "@/config";

const name = "ticket";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Creates a new support ticket")
  .addStringOption(option =>
    option
      .setName("title")
      .setDescription("Title of your problem")
      .setRequired(true)
      .setMaxLength(150)
  )
  .addStringOption(option =>
    option
      .setName("description")
      .setDescription("Describe your problem")
      .setRequired(true)
      .setMaxLength(2000)
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

    const title = interaction.options.get("title", true)!.value as string;
    const description = interaction.options.get("description", true)!.value as string;
    const { user } = interaction;

    const ticket = await prisma.tickets.create({
      data: {
        threadId: thread.id,
        userId: user.id,
        title
      }
    });

    if (!ticket) {
      thread.delete();
      return interaction.reply({
        content: "An error occured while creating ticket. Try again later.",
        ephemeral: true
      });
    }

    interaction.reply({
      content: "Support ticket created",
      ephemeral: true
    });

    const message = new EmbedBuilder({
      author: { name: user.username, icon_url: user.avatarURL() as string },
      title,
      description: `**Description** \n${description}`,
      timestamp: Date.now(),
      color: Colors.DarkBlue
    });

    await thread.setName(`ticket-${ticket.id}`);
    await thread.members.add(user.id);
    await thread.send({
      embeds: [message]
    });
  }
});

export default command;
