import {
  ChannelType,
  CommandInteraction,
  SlashCommandBuilder,
  ThreadChannel
} from "discord.js";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";
import { archiveTicket } from "@/api/db/";
import { DISCORD_CLIENT_ID } from "@/config";

const name = "close";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Closes ticket")
  .addChannelOption(option =>
    option
      .setName("channel")
      .setDescription("Ticket to close")
      .setRequired(true)
      .addChannelTypes(ChannelType.PrivateThread)
  );

const command = new Command({
  name: name,
  command: commandBuild as SlashCommandBuilder,
  admin: true,
  execute: async (
    interaction: CommandInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    const threadId = interaction.options.get("channel")!.value!;
    const thread = client.channels.cache.get(threadId.toString()) as ThreadChannel;
    if (!thread.name.includes("ticket-"))
      return interaction.reply({
        content: "Selected thread is not a support ticket",
        ephemeral: true
      });

    const ticketId = thread.name.replace("ticket-", "");

    archiveTicket(ticketId);
    const members = await thread.members.fetch();

    thread.setName(`closed-${thread.name}`);
    thread.setArchived(true);
    members.forEach(member => {
      if (member.id == DISCORD_CLIENT_ID) return;
      thread.members.remove(member.id);
    });

    return interaction.reply({
      content: "Thread archived",
      ephemeral: true
    });
  }
});

export default command;
