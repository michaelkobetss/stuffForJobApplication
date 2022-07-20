module.exports = async (GUILD_ID, rest, Routes, CLIENT_ID, commands) => {
    try {
      console.log("Started refreshing application (/) commands.");
      
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
      
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }
  