const express = require('express');
const router = express.Router();
const Mensaje = require('../models/mensaje');


// Obtener mensajes por chat
router.get('/chat/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const mensajesDB = await Mensaje.find({ chat: id })
            .populate('remitente', 'nombre apellido_paterno')
            .sort({ createdAt: 1 });
        res.json(mensajesDB);
    } catch (error) {
        console.log(error);
    }
});


// Crear mensaje
router.post('/', async (req, res) => {
    const body = req.body;
    try {
        await Mensaje.create(body);
        res.json({ estado: "Mensaje enviado correctamente" });
    } catch (error) {
        console.log(error);
    }
});


// Eliminar mensaje
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const mensajeDB = await Mensaje.findByIdAndDelete(id);
        if (mensajeDB) {
            res.json({
                estado: true,
                mensaje: "Mensaje eliminado correctamente"
            });
        } else {
            res.json({
                estado: false,
                mensaje: "No se encontró el mensaje"
            });
        }
    } catch (error) {
        console.log(error);
    }
});


// Marcar mensaje como leído
router.put('/leido/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Mensaje.findByIdAndUpdate(
            id,
            { leido: true },
            { useFindAndModify: false }
        );
        res.json({
            estado: true,
            mensaje: "Mensaje marcado como leído"
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
