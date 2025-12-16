const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');


// Obtrener todos
router.get('/todos',async(req, res)=>{
    try{
        const arrayUsuariosDB = await Usuario.find();
        console.log(arrayUsuariosDB);
        res.json(arrayUsuariosDB);
    }catch(error){
        console.log(error);
    }

});

// Para obtener un solo usuario de la base de datos (específico)
router.get('/:id', async(req, res)=>{
    const id = req.params.id;
    try{
        const arrayUsuariosDB = await Usuario.find({codigo_usuario: id});
        console.log(arrayUsuariosDB);
        res.json(arrayUsuariosDB);
    }catch(e){
        console.log(error);
    }
});

// Para insertar un documenta en la base de datos de mongo
router.post('/',async (req, res)=>{
    const body  = req.body;
    try{
        body.contrasena = bcrypt.hashSync(body.contrasena, 10);
        await Usuario.create(body);
        console.log("Registro insertado exitosamente en la base de datos");
        res.json({estado:"Usuario insertado exitosamente"});
    }catch(error){
        console.log(error);
    }
});

// Para eliminar un documento de la base de datos de Mongo
router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    try{
        const usuarioDB = await Usuario.findOneAndDelete({codigo_usuario:id});
        if(usuarioDB){
            res.json({estado:true,
                    mensaje:"Usuario eliminado de la base de datos"
            })
        }
        else{
            res.json({estado:false,
                    mensaje:"No se puedo el usuario solicitado"
            })
        }
    }catch(error){
        console.log(error);
    }
});

// Para actualizar los datos
router.put('/:id', async (req, res)=>{
    const id = req.params.id;
    const body = req.body;
    try{
        const usuarioDB = await Usuario.findOneAndUpdate({codigo_usuario:id}, body, {useFindAndModify:false});
        res.json({
            estado:true,
            mensaje:"El usuario ha sido actualizado correctamente"
        })
    }catch(error){
        console.log(error);
        res.json({
            estado:false,
            mensaje:"Los datos del usuario no han sido actualizados"
        })
    }
});

module.exports=router;