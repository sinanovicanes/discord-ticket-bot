import { Client, Guild } from "discord.js";
import { User } from "@/modules";

interface CommandExecuteParams {
  client: Client;
  guild: Guild;
  userData: User;
}
