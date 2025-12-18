const express = require("express");
const router = express.Router();
const Mensaje = require("../models/mensaje");
const Usuario = require("../models/usuario");

// OBTENER MENSAJES DE UN CHAT
router.get("/chat/:id", async (req, res) => {
  try {
    const mensajes = await Mensaje.find({ chat: req.params.id })
      .populate("remitente", "codigo_usuario nombre apellido_paterno")
      .sort({ createdAt: 1 });

    res.json(mensajes);
  } catch (error) {
    console.log("ERROR obtener mensajes:", error);
    res.status(500).json({ mensaje: "Error al obtener mensajes" });
  }
});

// ENVIAR MENSAJE
router.post("/", async (req, res) => {
  try {
    const { chat, codigo_usuario, contenido } = req.body;

    if (!chat || !codigo_usuario || !contenido?.trim()) {
      return res.status(400).json({
        mensaje: "chat, codigo_usuario y contenido son obligatorios"
      });
    }

    const usuario = await Usuario.findOne({ codigo_usuario });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const mensaje = await Mensaje.create({
      chat,
      remitente: usuario._id,
      contenido: contenido.trim(),
      leido: false
    });

    const mensajeCompleto = await Mensaje.findById(mensaje._id)
      .populate("remitente", "codigo_usuario nombre apellido_paterno");

    // ✅ Emitir por Socket.IO a la sala del chat
    const io = req.app.get("io");
    io.to(chat).emit("nuevo_mensaje", mensajeCompleto);

    res.json(mensajeCompleto);
  } catch (error) {
    console.log("ERROR enviar mensaje:", error);
    res.status(500).json({ mensaje: "Error al enviar mensaje" });
  }
});

// MARCAR MENSAJE COMO LEÍDO
router.put("/leido/:id", async (req, res) => {
  try {
    await Mensaje.findByIdAndUpdate(req.params.id, { leido: true });
    res.json({ estado: true });
  } catch (error) {
    console.log("ERROR marcar leído:", error);
    res.status(500).json({ mensaje: "Error al marcar como leído" });
  }
});

// ELIMINAR MENSAJE
router.delete("/:id", async (req, res) => {
  try {
    await Mensaje.findByIdAndDelete(req.params.id);
    res.json({ estado: true });
  } catch (error) {
    console.log("ERROR eliminar mensaje:", error);
    res.status(500).json({ mensaje: "Error al eliminar mensaje" });
  }
});

module.exports = router;
