module.exports = async (interaction, client) => {
  let membersToTag = await interaction.options.data[1].role.members.keys();
  let tagArr = [...membersToTag];

  await tagArr.map((user, index) => {
    setTimeout(() => {
      client.users.cache
        .get(user)
        .send(
          `${interaction.options.data[0].value}
          -------------------
          author: ${interaction.member.nickname}`
        )
        .catch((err) => {
          console.log(err);
        });

      console.log(`message sent to ${user}`);
    }, 6000 * index);
  });

  await interaction.reply(`Message sent: ${interaction.options.data[0].value}
recievers: ${tagArr}`);
};
