const app = require("./src/app");

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`);
})

process.on('SIGINT',() => {
    server.close(() => console.log("exit server express"));
})