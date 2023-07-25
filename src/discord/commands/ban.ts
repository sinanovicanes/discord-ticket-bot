import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandExecuteParams } from "../types";
import { Command } from "../command";
import { banUser } from "@/api";
import { User } from "@/user";

const name = "ban";
const commandBuild = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Ban User")
  .addUserOption(option =>
    option.setName("user").setDescription("User to ban").setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName("duration")
      .setDescription("Ban duration")
      .setRequired(true)
      .addChoices({ name: "1 Hour", value: 1 })
      .addChoices({ name: "1 Day", value: 24 })
      .addChoices({ name: "3 Day", value: 24 * 3 })
      .addChoices({ name: "7 Day", value: 24 * 7 })
      .addChoices({ name: "30 Day", value: 24 * 30 })
      .addChoices({ name: "1 Year", value: 24 * 365 })
      .addChoices({ name: "Permanent", value: 365 * 10 })
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
    const duration = interaction.options.get("duration")!.value! as number;

    const targetUser = new User(client, guild, user);

    if (targetUser.admin)
      return interaction.reply({
        content: `${targetUser.username} has required permissions`,
        ephemeral: true
      });

    const bannedUntil = new Date(Date.now() + duration * 60 * 60 * 1000);
    banUser(user.id, bannedUntil);

    return interaction.reply({
      content: `${user.username} banned until ${bannedUntil.toDateString()}`,
      ephemeral: true
    });
  }
});

export default command;
