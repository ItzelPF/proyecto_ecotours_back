const express = require('express');
const router = express.Router();
const Agenda = require('../models/agenda');
const Usuario = require('../models/usuario');
const Cliente = require('../models/cliente');

// GET /agenda/calendario
router.get('/calendario', async (req, res) => {
    try {
        const citas = await Agenda
            .find()
            .populate('cliente', 'nombre apellido_paterno telefono');

        const eventos = citas.map(cita => {
            const fecha = cita.fecha.toISOString().split('T')[0];

            return {
                id: cita._id,
                title: cita.titulo,
                start: `${fecha}T${cita.hora_inicio}`,
                end: `${fecha}T${cita.hora_fin}`,
                estado: cita.estado,
                cliente: cita.cliente,
                notas: cita.notas
            };
        });

        res.json(eventos);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al cargar agenda' });
    }
});

//Obtener todas las citas
router.get('/todos', async (req, res) => {
    try {
        const arrayAgendaDB = await Agenda
            .find()
            .populate('cliente', 'nombre apellido_paterno telefono');
        console.log(arrayAgendaDB);
        res.json(arrayAgendaDB);
    } catch (error) {
        console.log(error);
    }
});


//Obtener una sola cita por su código
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const agendaDB = await Agenda
            .find({ codigo_cita: id })
            .populate('cliente', 'nombre apellido_paterno telefono');

        console.log(agendaDB);
        res.json(agendaDB);
    } catch (error) {
        console.log(error);
    }
});


//insertar una nueva cita
router.post('/', async (req, res) => {
    try {
        const {
            codigo_usuario,
            codigo_cliente,
            ...resto
        } = req.body;

        const usuario = await Usuario.findOne({ codigo_usuario });
        if (!usuario) {
            return res.json({
                estado: false,
                mensaje: "Usuario no encontrado"
            });
        }

        let cliente = null;
        if (codigo_cliente) {
            cliente = await Cliente.findOne({ codigo_cliente });
            if (!cliente) {
                return res.json({
                    estado: false,
                    mensaje: "Cliente no encontrado"
                });
            }
        }

        await Agenda.create({
            ...resto,
            usuario: usuario._id,
            cliente: cliente ? cliente._id : undefined
        });

        res.json({
            estado: true,
            mensaje: "Cita registrada correctamente"
        });

    } catch (error) {
        console.log(error);
        res.json({
            estado: false,
            mensaje: "Error al registrar la cita"
        });
    }
});


//Eliminar una cita
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const agendaDB = await Agenda.findByIdAndDelete(id);

        if (!agendaDB) {
            return res.json({
                estado: false,
                mensaje: "No se encontró la cita"
            });
        }

        res.json({
            estado: true,
            mensaje: "Cita eliminada correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            estado: false,
            mensaje: "No se pudo eliminar la cita"
        });
    }
});

//Actualizar una cita
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await Agenda.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            estado: true,
            mensaje: "Cita actualizada correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            estado: false,
            mensaje: "No se pudo actualizar la cita"
        });
    }
});

module.exports = router;
