require("dotenv").config();

const { TOKEN, CLIENT_ID, GUILD_ID, PS2_SERVICE_ID } = process.env;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const Permissions = require("discord.js");
const commands = require("./commands/commands.js");
const ping = require("./commands/ping.js");
const dmall = require("./commands/dmall.js");
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

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
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await ping(interaction);
    console.log(
      interaction.member.permissions.has(
        Permissions.PermissionFlagsBits.BanMembers
      )
    );
  }

  if (
    interaction.commandName === "dmall" &&
    interaction.member.permissions.has(
      Permissions.PermissionFlagsBits.BanMembers
    )
  ) {
    let membersToTag = await interaction.options.data[1].role.members.keys();
    let tagArr = [...membersToTag];

    await tagArr.map((user, index) => {
      setTimeout(() => {
        client.users.cache
          .get(user)
          .send(interaction.options.data[0].value)
          .catch((err) => {
            console.log(err);
          });

        console.log(`message sent to ${user}`);
      }, 6000 * index);
    });

    await interaction.reply(`Message sent: ${interaction.options.data[0].value}
recievers: ${tagArr}`);
  }
  else {interaction.reply("Not not enough perms for this command")}
});

client.login(TOKEN);
