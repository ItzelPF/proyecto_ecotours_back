const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN DE USUARIO
router.post('/login', async (req, res) => {
    const { correo_electronica, contrasena } = req.body;

    try {
        // Buscar usuario por correo
        const usuarioDB = await Usuario.findOne({ correo_electronica });

        if (!usuarioDB) {
            return res.json({
                estado: false,
                mensaje: 'El usuario no existe'
            });
        }

        // Verificar estatus
        if (usuarioDB.estatus === 0) {
            return res.json({
                estado: false,
                mensaje: 'Usuario inactivo'
            });
        }

        // Comparar contraseñas
        const passwordValida = bcrypt.compareSync(
            contrasena,
            usuarioDB.contrasena
        );

        if (!passwordValida) {
            return res.json({
                estado: false,
                mensaje: 'Contraseña incorrecta'
            });
        }

        // Crear token
        const token = jwt.sign(
            {
                id: usuarioDB._id,
                rol: usuarioDB.rol,
                codigo_usuario: usuarioDB.codgio_usuario
            },
            'CLAVE_SECRETA',
            { expiresIn: '8h' }
        );

        res.json({
            estado: true,
            mensaje: 'Login correcto',
            token,
            usuario: {
                codgio_usuario: usuarioDB.codgio_usuario,
                nombre: usuarioDB.nombre,
                apellido_paterno: usuarioDB.apellido_paterno,
                apellido_materno: usuarioDB.apellido_materno,
                rol: usuarioDB.rol,
                correo_electronica: usuarioDB.correo_electronica
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            estado: false,
            mensaje: 'Error en el login'
        });
    }
});

module.exports = router;
