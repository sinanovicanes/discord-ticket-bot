import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandExecuteParams } from "./types";
import { REQUIRED_PERMISSIONS } from "@/config";

interface CommandParams {
  name: string;
  command: SlashCommandBuilder;
  admin?: boolean;
  execute: (interaction: CommandInteraction, data: CommandExecuteParams) => void;
}

export class Command {
  name: string;
  command: SlashCommandBuilder;
  admin: boolean;
  execute: (interaction: CommandInteraction, data: CommandExecuteParams) => void;

  constructor({ name, command, admin = false, execute }: CommandParams) {
    this.name = name;
    this.command = command;
    this.admin = admin;
    this.execute = execute;
    if (this.admin) {
      this.command.setDefaultMemberPermissions(REQUIRED_PERMISSIONS);
    }
  }
}
