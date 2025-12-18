const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: ["privado", "grupo"],
      required: true
    },

    participantes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
      }
    ],

    nombre_chat: {
      type: String,
      required: function () {
        return this.tipo === "grupo";
      }
    },

    creado_por: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },

    ultimo_mensaje: String
  },
  {
    timestamps: {
      createdAt: "creado_en",
      updatedAt: "actualizado_en"
    }
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
