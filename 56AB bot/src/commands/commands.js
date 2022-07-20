module.exports = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "dmall",
    description: "Sends a message to every 56AB member",
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
