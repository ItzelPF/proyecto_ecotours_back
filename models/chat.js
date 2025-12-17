const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    codigo_chat:Number,

    participantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }],

    tipo: {
        type: String,
        enum: ['privado', 'grupo'],
        default: 'privado'
    },

    nombre_chat: String 

});

module.exports = mongoose.model('Chat', ChatSchema);
