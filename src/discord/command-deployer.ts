import { Routes, REST } from "discord.js";
import * as commandModules from "./commands";

const commands = Object.values(commandModules).map(command => command.default.command);

export const CommandDeployer = {
  async deploy(token: string, clientId: string, guildId: string) {
    const rest = new REST({ version: "9" }).setToken(token);
    return await rest
      .put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands
      })
      .then(() => {
        console.log("DISCORD BOT COMMANDS DEPLOYED 🤖");
      })
      .catch(console.error);
  }
};
