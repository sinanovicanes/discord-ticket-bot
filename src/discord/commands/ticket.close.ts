import {
  AutocompleteInteraction,
  ChannelType,
  Colors,
  CommandInteraction,
  EmbedBuilder,
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
  .addStringOption(option =>
    option
      .setName("channel")
      .setDescription("Ticket to close")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addBooleanOption(option =>
    option.setName("solved").setDescription("Is ticket solved").setRequired(true)
  );

const command = new Command({
  name: name,
  command: commandBuild as SlashCommandBuilder,
  admin: true,
  execute: async (
    interaction: CommandInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    const threadId = interaction.options.get("channel")!.value! as string;
    const solved: boolean =
      (interaction.options.get("solved")?.value as boolean) ?? false;
    const thread = client.channels.cache.get(threadId) as ThreadChannel;
    if (!thread.name.includes("ticket-"))
      return interaction.reply({
        content: "Selected thread is not a support ticket",
        ephemeral: true
      });

    const ticketId = thread.name.replace("ticket-", "");

    archiveTicket(ticketId);
    const members = await thread.members.fetch();

    members.forEach(member => {
      if (member.id == DISCORD_CLIENT_ID) return;
      thread.members.remove(member.id);
    });

    const embed = new EmbedBuilder({
      author: {
        name: client.user!.username,
        iconURL: client.user!.avatarURL() as string
      },
      title: "Closed",
      description: `**Solved:** ${solved ? ":heavy_plus_sign:" : ":heavy_minus_sign:"}`,
      color: Colors.DarkBlue,
      timestamp: Date.now()
    });

    thread.send({ embeds: [embed] }).then(() => {
      thread.setName(`closed-${thread.name}`).then(() => thread.setArchived(true));
    });

    return interaction.reply({
      content: "Thread archived",
      ephemeral: true
    });
  },
  autocomplete: async (
    interaction: AutocompleteInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    const focusedOption = interaction.options.getFocused(true);
    const channels = client.channels.cache.filter(
      channel =>
        channel.type == ChannelType.PrivateThread &&
        channel.name.startsWith("ticket-") &&
        channel.name.includes(focusedOption.value)
    );

    await interaction.respond(
      channels.map(channel => ({
        name: (channel as ThreadChannel).name,
        value: channel.id
      }))
    );
  }
});

export default command;
