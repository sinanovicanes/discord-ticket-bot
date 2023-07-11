# Discord Ticket Bot

A node.js discord bot written to create and manage tickets via threads.

# Installation

1. Clone this repository.
1. Make sure you have [Node.JS](https://nodejs.org/en/) installed.
1. Run `npm i` to install the node modules.
1. You will need an app from [Discord My Apps](https://discordapp.com/developers/applications/me). You will need the apps **_Client ID_** and **_Bot Token_** these belong inside `.env` file.
1. Create .env file for environment variables.
   | Key | Type | Description |
   |-|-|-|
   | DATABASE_URL | string | Database URL for prisma |
   | DISCORD_TOKEN | string | Your discord app's token |
   | DISCORD_CLIENT_ID | string | Your discord bot's client id |
   | DISCORD_GUILD_ID | string | Discord server id |
1. Give the bot permissions on your server using this url `https://discordapp.com/oauth2/authorize?client_id=__CLIENT_ID__&scope=bot&permissions=17179871232` and replace `__CLIENT_ID__` with your bot's client id.
1. You need to create text channel for threads and set channel id from `config.ts->TICKET_CHANNEL_ID`. Threads will be created from this channel.
1. Run `npx prisma db push` to push database.
1. Run `npm run start` to start the bot.

# Commands

| Command | Description                                    | Permission Required |
| ------- | ---------------------------------------------- | ------------------- |
| ban     | Bans user from using this bots commands        | true                |
| unban   | Unbans user from using this bots commands      | true                |
| send    | Sends your message via bot to selected channel | true                |
| reply   | Replies ticket with your message from bot      | true                |
| close   | Closes ticket & archives ticket's thread       | true                |
| ticket  | Creates new ticket                             | false               |

# Notes

1. Only people with `Manage Threads` permission can use permission required commands & see threads. You can change the required permission from `config.ts->REQUIRED_PERMISSIONS` for permission required commands but people with `Manage Threads` still can see the threads.
