const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS manual 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// CONEXIÓN MONGODB
mongoose
    .connect("mongodb://127.0.0.1:27017/eco_tours", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() =>
        console.log("MongoDB conectado correctamente")
    )
    .catch((e) => console.log(e));

// RUTAS API
app.use("/auth", require("./router/Auth"));
app.use("/usuarios", require("./router/Usuarios"));
app.use("/clientes", require("./router/Clientes"));
app.use("/agenda", require("./router/Agenda"));
app.use("/chat", require("./router/Chat"));
app.use("/mensaje", require("./router/Mensaje"));

// SERVER HTTP + SOCKET.IO
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Guardar io en app para usarlo en los routers
app.set("io", io);

// SOCKET EVENTS
io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

    socket.on("join_chat", (chatId) => {
        if (chatId) {
            socket.join(chatId);
            console.log(`Socket ${socket.id} unido al chat ${chatId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("Socket desconectado:", socket.id);
    });
});

// START SERVER
server.listen(port, () => {
    console.log("Servidor activo en puerto", port);
});
