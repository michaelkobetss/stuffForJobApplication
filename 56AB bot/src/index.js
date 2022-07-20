require("dotenv").config();

const { TOKEN, CLIENT_ID, GUILD_ID, PS2_SERVICE_ID, ADMIN_USER_ID } =
  process.env;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const Permissions = require("discord.js");
const rest = new REST({ version: "10" }).setToken(TOKEN);

// commands improted ====================================================
const commands = require("./commands/commands.js");
const help = require("./commands/help.js");
const updateGuild = require("./commands/updateGuild.js");
const ping = require("./commands/ping.js");
const dmall = require("./commands/dmall.js");

updateGuild(GUILD_ID, rest, Routes, CLIENT_ID, commands);

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.forEach((e) => updateGuild(e.id, rest, Routes, CLIENT_ID, commands));
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return ping(interaction);
  }

  if (interaction.commandName === "help") {
    return help(interaction, commands);
  }

  if (
    interaction.commandName === "dmall" &&
    interaction.member.permissions.has(
      Permissions.PermissionFlagsBits.BanMembers
    )
  ) {
    return dmall(interaction, client);
  } else {
    return interaction.reply("Not not enough perms for this command");
  }
});

client.on("guildCreate", (guild) => {
  updateGuild(guild.id, rest, Routes, CLIENT_ID, commands);
});

client.login(TOKEN);
