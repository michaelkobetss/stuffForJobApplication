module.exports = async (int, list) => {
    let commandsArr =  [];
    list.map((i) => {
        commandsArr.push(`\n**${i.name}:** ${i.description} `);
    });
    // console.log(...commandsArr);
  int.reply(commandsArr.toString())
};
