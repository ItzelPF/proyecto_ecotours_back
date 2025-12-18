const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const Usuario = require("../models/usuario");

// OBTENER CHATS DE UN USUARIO
router.get("/", async (req, res) => {
    try {
        const { codigo_usuario } = req.query;

        if (!codigo_usuario) {
            return res.status(400).json({ mensaje: "codigo_usuario requerido" });
        }

        const usuario = await Usuario.findOne({ codigo_usuario });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const chats = await Chat.find({
            participantes: usuario._id
        })
            .populate("participantes", "codigo_usuario nombre apellido_paterno rol")
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al obtener chats" });
    }
});

// OBTENER CHAT POR ID
router.get("/:id", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate("participantes", "codigo_usuario nombre apellido_paterno rol");

        if (!chat) {
            return res.status(404).json({ mensaje: "Chat no encontrado" });
        }

        res.json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al obtener chat" });
    }
});

// CREAR O REUTILIZAR CHAT PRIVADO
router.post("/privado", async (req, res) => {
    try {
        const { codigo_usuario_origen, codigo_usuario_destino } = req.body;

        if (!codigo_usuario_origen || !codigo_usuario_destino) {
            return res.status(400).json({
                mensaje: "codigo_usuario_origen y codigo_usuario_destino son obligatorios"
            });
        }

        if (codigo_usuario_origen === codigo_usuario_destino) {
            return res.status(400).json({
                mensaje: "No puedes crear un chat contigo mismo"
            });
        }

        const usuarioOrigen = await Usuario.findOne({
            codigo_usuario: codigo_usuario_origen
        });

        const usuarioDestino = await Usuario.findOne({
            codigo_usuario: codigo_usuario_destino
        });

        if (!usuarioOrigen || !usuarioDestino) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        let chat = await Chat.findOne({
            tipo: "privado",
            participantes: {
                $all: [usuarioOrigen._id, usuarioDestino._id]
            }
        });

        if (!chat) {
            chat = await Chat.create({
                tipo: "privado",
                participantes: [usuarioOrigen._id, usuarioDestino._id],
                creado_por: usuarioOrigen._id
            });
        }
        const chatPopulado = await Chat.findById(chat._id)
            .populate(
                "participantes",
                "codigo_usuario nombre apellido_paterno apellido_materno rol"
            );

        res.json(chatPopulado);

    } catch (error) {
        console.error("ERROR /chat/privado:", error);
        res.status(500).json({
            mensaje: "Error al crear o recuperar chat privado"
        });
    }
});


// CREAR CHAT GRUPAL
router.post("/grupo", async (req, res) => {
    try {
        const { codigo_usuario_creador, nombre_chat, participantes } = req.body;

        if (!codigo_usuario_creador || !nombre_chat || !Array.isArray(participantes)) {
            return res.status(400).json({ mensaje: "Datos inválidos" });
        }

        const usuarios = await Usuario.find({
            codigo_usuario: { $in: participantes }
        });

        const creador = await Usuario.findOne({ codigo_usuario: codigo_usuario_creador });

        if (!creador) {
            return res.status(404).json({ mensaje: "Creador no encontrado" });
        }

        const ids = usuarios.map(u => u._id);

        if (!ids.some(id => id.equals(creador._id))) {
            ids.push(creador._id);
        }

        const chat = await Chat.create({
            tipo: "grupo",
            nombre_chat,
            participantes: ids
        });

        res.json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al crear grupo" });
    }
});

module.exports = router;
