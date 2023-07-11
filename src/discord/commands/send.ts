import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";

const name = "send";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Send message to specific channel")
  .addChannelOption(option =>
    option
      .setName("channel")
      .setDescription("Channel that message going to send")
      .setRequired(true)
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
  execute: async (
    interaction: CommandInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    const channelId = interaction.options.data.find(op => op.name == "channel")!.value!;
    const message = interaction.options.data.find(op => op.name == "message")!
      .value! as string;
    const channel = client.channels.cache.get(channelId.toString()) as TextChannel;

    if (!channel)
      return interaction.reply({
        content: "Channel not found",
        ephemeral: true
      });

    try {
      await channel.send(message);
    } catch (error) {
      console.log(`Error while sending message to ${channel.name}`);
      console.log(error);
      return interaction.reply({
        content: `Error occurred while sending message to ${channel.name}`,
        ephemeral: true
      });
    }

    return interaction.reply({
      content: `Message sended to ${channel.name}`,
      ephemeral: true
    });
  }
});

export default command;
