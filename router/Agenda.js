const express = require('express');
const router = express.Router();
const Agenda = require('../models/agenda');


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
    const body = req.body;

    try {
        await Agenda.create(body);
        console.log("Cita insertada exitosamente");
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
    const id = req.params.id;

    try {
        const agendaDB = await Agenda.findOneAndDelete({ codigo_cita: id });

        if (agendaDB) {
            res.json({
                estado: true,
                mensaje: "Cita eliminada correctamente"
            });
        } else {
            res.json({
                estado: false,
                mensaje: "No se encontró la cita"
            });
        }
    } catch (error) {
        console.log(error);
    }
});


//Actualizar una cita
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        await Agenda.findOneAndUpdate(
            { codigo_cita: id },
            body,
            { useFindAndModify: false }
        );

        res.json({
            estado: true,
            mensaje: "Cita actualizada correctamente"
        });
    } catch (error) {
        console.log(error);
        res.json({
            estado: false,
            mensaje: "No se pudo actualizar la cita"
        });
    }
});

module.exports = router;
