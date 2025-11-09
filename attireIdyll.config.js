// attireIdyll.config.js
module.exports = {
  apps: [
    {
      name: "attireIdyll",
      cwd: "/root/attireIdyll-v2",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
      },
      watch: true,
      ignore_watch: ["node_modules", "*git"],
      restart_delay: 10000,
      max_memory_restart: "300M",
    },
  ],
};
