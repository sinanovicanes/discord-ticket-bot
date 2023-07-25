import {
  Client,
  User as DiscordUser,
  Guild,
  GuildMember,
  GuildMemberRoleManager
} from "discord.js";
import { prisma, ubanUser } from "@/api";

export class User {
  id: DiscordUser["id"];
  username: string;
  admin = false;
  avatar?: string;
  bannedUntil?: Date;
  client: Client;
  guild: Guild;
  discord: DiscordUser;
  member: GuildMember;

  constructor(client: Client, guild: Guild, user: DiscordUser) {
    this.client = client;
    this.guild = guild;
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatarURL() ?? undefined;
    this.discord = user;
    this.member = this.guild.members.cache.get(this.id)!;
    this.admin = this.member.permissions.has("ManageThreads");
  }

  isBanned(): { banned: boolean; message: string } {
    if (!this.bannedUntil) return { banned: false, message: "" };

    if (Date.now() >= this.bannedUntil.getTime()) {
      ubanUser(this.id);
      return { banned: false, message: "" };
    }

    const diff = this.bannedUntil.getFullYear() - new Date().getFullYear();
    const message =
      diff >= 1
        ? "You've been banned"
        : `You've been banned until ${this.bannedUntil.toDateString()}`;

    return { banned: true, message };
  }

  async fetch() {
    const fetchedUser = await prisma.bannedUsers.findUnique({
      where: {
        id: this.id
      }
    });

    this.bannedUntil = fetchedUser?.bannedUntil ?? undefined;

    return this;
  }
}
