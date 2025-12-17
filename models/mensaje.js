const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MensajeSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },

    remitente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    contenido: String,

    leido:Boolean,

});

module.exports = mongoose.model('Mensaje', MensajeSchema);
