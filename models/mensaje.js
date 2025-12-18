const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MensajeSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },

    remitente: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },

    contenido: {
      type: String,
      required: true
    },

    leido: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // 👈 CLAVE
  }
);

module.exports = mongoose.model("Mensaje", MensajeSchema);
