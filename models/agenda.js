const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgendaSchema = new Schema({
    codigo_cita: Number,
    // Relación con cliente
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    titulo:String,
    descripcion: String,
    fecha: {
        type: Date,
        required: true
    },

    hora_inicio: {
        type: String, // ejemplo: "10:30"
        required: true
    },
    hora_fin:String,
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada', 'realizada'],
        default: 'pendiente'
    },
    notas: String
});

module.exports = mongoose.model('Agenda', AgendaSchema);
