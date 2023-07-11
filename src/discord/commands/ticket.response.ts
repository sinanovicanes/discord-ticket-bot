import {
  ChannelType,
  CommandInteraction,
  SlashCommandBuilder,
  TextChannel
} from "discord.js";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";

const name = "reply";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Replies ticket")
  .addChannelOption(option =>
    option
      .setName("channel")
      .setDescription("Ticket that message going to send")
      .setRequired(true)
      .addChannelTypes(ChannelType.PrivateThread)
  )
  .addStringOption(option =>
    option
      .setName("message")
      .setDescription("Message that you want to send")
      .setRequired(true)
  );

const command = new Command({
  name: name,
  command: commandBuild as SlashCommandBuilder,
  admin: true,
  execute: (
    interaction: CommandInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    const channelId = interaction.options.data.find(op => op.name == "channel")!.value!;
    const message = interaction.options.data.find(op => op.name == "message")!.value!;
    const channel = client.channels.cache.get(channelId.toString()) as TextChannel;

    if (!channel)
      return interaction.reply({
        content: "Channel not found",
        ephemeral: true
      });

    channel.send(message.toString());

    return interaction.reply({
      content: `Message sended to ${channel.name}`,
      ephemeral: true
    });
  }
});

export default command;
