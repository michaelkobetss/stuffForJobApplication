require("dotenv").config();

const { TOKEN, CLIENT_ID, GUILD_ID, PS2_SERVICE_ID } = process.env;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
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
  }

  if (interaction.commandName === "dmall") {
    await console.log(interaction.guild.members);
    let membersToTag = await interaction.options.data[1].role.members.keys();
    let tagArr = [...membersToTag];

    await tagArr.map((item, index) => {
      setTimeout(() => {
        client.users.cache
          .get(item)
          .send(interaction.options.data[0].value)
          .catch((err) => {
            console.log(err);
          });

        console.log(`message sent to ${item}`);
      }, 1000 * index);
    });

    await interaction.reply(`Message sent: ${interaction.options.data[0].value}
recievers: ${tagArr}`);
  }
});

client.login(TOKEN);
