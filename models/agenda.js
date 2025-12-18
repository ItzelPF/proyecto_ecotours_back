const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgendaSchema = new Schema({
    codigo_cita: Number,

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: false
    },

    titulo: String,
    descripcion: String,
    fecha: Date,
    hora_inicio: String,
    hora_fin: String,

    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada', 'realizada'],
        default: 'pendiente'
    },

    notas: String
});


module.exports = mongoose.model('Agenda', AgendaSchema);
