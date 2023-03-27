module.exports = {
    apps: [
        {
            name: "app",
            script: "./app.js",
            instances: "max",
            exec_mode: "cluster",
            wait_ready: true,
            max_memory_restart: "2G",
            listen_timeout: 50000,
            kill_timeout: 5000,
        },
    ],
};