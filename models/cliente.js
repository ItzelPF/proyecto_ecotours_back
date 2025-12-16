const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const ClientesSchema = Schema({
    codigo_cliente:Number,
    nombre:String,
    apellido_paterno:String,
    apellido_materno:String,
    correo_electronica: String,
    telefono: Number,
    ciudad: String,
    estado: String,
    notas: String,
});

const Cliente = mongoose.model('Cliente',ClientesSchema);
module.exports = Cliente;
