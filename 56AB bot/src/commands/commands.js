module.exports = [
  {
    name: "help",
    description: "List of all commands available",
  },
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "dmall",
    description: "Sends a message to every member of a selected role",
    options: [
      {
        name: "message",
        description: "Your input",
        type: "3",
        required: true,
      },
      {
        name: "role",
        description: "Pick a role to ping",
        type: "8",
        required: true,
      },
    ],
  },
  
];
