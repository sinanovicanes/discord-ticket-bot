import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";
import { ubanUser } from "@/api";
import { User } from "@/user";

const name = "unban";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Unban user")
  .addUserOption(option =>
    option.setName("user").setDescription("User to unban").setRequired(true)
  );

const command = new Command({
  name: name,
  command: commandBuild as SlashCommandBuilder,
  admin: true,
  execute: async (
    interaction: CommandInteraction,
    { client, guild, userData }: CommandExecuteParams
  ) => {
    const user = interaction.options.get("user")!.user!;
    const targetUser = await new User(client, guild, user).fetch();

    const { banned } = targetUser.isBanned();

    if (!banned)
      return interaction.reply({
        content: `${user.username} not banned`,
        ephemeral: true
      });

    ubanUser(user.id);

    return interaction.reply({
      content: `${user.username} unbanned`,
      ephemeral: true
    });
  }
});

export default command;
