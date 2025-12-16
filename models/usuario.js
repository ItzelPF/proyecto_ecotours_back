const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSchema = Schema({
    codigo_usuario:Number,
    nombre:String,
    apellido_paterno:String,
    apellido_materno:String,
    rol:String,
    correo_electronica: String,
    contrasena: String,
    telefono: Number,
    estatus: Number
});

const Usuario = mongoose.model('Usuario',UsuariosSchema);
module.exports = Usuario;
