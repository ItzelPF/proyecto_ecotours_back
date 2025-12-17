const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');


// Obtener todos los chats
router.get('/todos', async (req, res) => {
    try {
        const arrayChatsDB = await Chat.find()
            .populate('participantes', 'nombre apellido_paterno rol');
        res.json(arrayChatsDB);
    } catch (error) {
        console.log(error);
    }
});


// Obtener un chat por codigo_chat
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const chatDB = await Chat.find({ codigo_chat: id })
            .populate('participantes', 'nombre apellido_paterno rol');
        res.json(chatDB);
    } catch (error) {
        console.log(error);
    }
});


// Crear un chat
router.post('/', async (req, res) => {
    const body = req.body;
    try {
        await Chat.create(body);
        res.json({ estado: "Chat creado correctamente" });
    } catch (error) {
        console.log(error);
    }
});


// Eliminar un chat
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const chatDB = await Chat.findOneAndDelete({ codigo_chat: id });
        if (chatDB) {
            res.json({
                estado: true,
                mensaje: "Chat eliminado correctamente"
            });
        } else {
            res.json({
                estado: false,
                mensaje: "No se encontró el chat"
            });
        }
    } catch (error) {
        console.log(error);
    }
});


// Actualizar chat
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        await Chat.findOneAndUpdate(
            { codigo_chat: id },
            body,
            { useFindAndModify: false }
        );
        res.json({
            estado: true,
            mensaje: "Chat actualizado correctamente"
        });
    } catch (error) {
        console.log(error);
        res.json({
            estado: false,
            mensaje: "No se pudo actualizar el chat"
        });
    }
});

module.exports = router;
