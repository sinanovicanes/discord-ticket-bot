import { Client, Events, Guild } from "discord.js";
import Config from "@/config";
import { CommandDeployer } from "./command-deployer";
import * as commandModules from "./commands";
import { User } from "@/user";

const commands = Object.fromEntries(
  Object.values(commandModules).map(module => [module.default.name, module.default])
);

export class DiscordBot {
  static instance: DiscordBot;
  static getInstance() {
    if (!this.instance) {
      this.instance = new DiscordBot();
    }

    return this.instance;
  }

  client: Client;
  guild?: Guild;

  constructor() {
    this.client = new Client({
      intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMembers"]
    });
    this.client.login(Config.DISCORD_TOKEN);

    this.client.guilds
      .fetch(Config.DISCORD_GUILD_ID)
      .then(guild => (this.guild = guild))!;

    this.client.once("ready", async () => {
      console.log("DISCORD BOT ACTIVE! 🤖");
      this.registerCommands();
    });
  }

  destroy() {
    this.client.destroy();
  }

  registerCommands() {
    CommandDeployer.deploy(
      Config.DISCORD_TOKEN,
      Config.DISCORD_CLIENT_ID,
      Config.DISCORD_GUILD_ID
    ).then(() => {
      this.client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isAutocomplete()) return;

        const { commandName, user } = interaction;
        const userData = await new User(this.client, this.guild!, user).fetch();

        const { banned, message } = userData.isBanned();

        if (banned) {
          return;
        }

        const command = commands[commandName];

        if (!command.autocomplete || (command.admin && !userData.admin)) {
          return;
        }

        try {
          command.autocomplete(interaction, {
            client: this.client,
            guild: this.guild!,
            userData
          });
        } catch (error) {
          console.log(`Error while auto completing ${commandName}`);
          console.log(error);
        }
        return;
      });

      this.client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;
        const { commandName, user } = interaction;
        const userData = await new User(this.client, this.guild!, user).fetch();

        const { banned, message } = userData.isBanned();

        if (banned) {
          interaction.reply({
            content: message,
            ephemeral: true
          });
          return;
        }

        const command = commands[commandName];

        if (command.admin && !userData.admin) {
          interaction.reply({
            content: "This command has too much powers for you to handle 🤖☠️",
            ephemeral: true
          });
          return;
        }

        try {
          command.execute(interaction, {
            client: this.client,
            guild: this.guild!,
            userData
          });
        } catch (error) {
          console.log(`Error while executing ${commandName}`);
          console.log(error);
        }
      });
    });
  }
}
