const express = require('express');
const router = express.Router();
const Cliente = require('../models/cliente');

// Obtener todos
router.get('/todos',async(req, res)=>{
    try{
        const arrayClientesDB = await Cliente.find();
        console.log(arrayClientesDB);
        res.json(arrayClientesDB);
    }catch(error){
        console.log(error);
    }

});

// Para obtener un solo cliente de la base de datos (específico)
router.get('/:id', async(req, res)=>{
    const id = req.params.id;
    try{
        const arrayClientesDB = await Cliente.find({codigo_cliente: id});
        console.log(arrayClientesDB);
        res.json(arrayClientesDB);
    }catch(e){
        console.log(error);
    }
});

// Para insertar un documenta en la base de datos de mongo
router.post('/',async (req, res)=>{
    const body  = req.body;
    try{
        await Cliente.create(body);
        console.log("Registro insertado exitosamente en la base de datos");
        res.json({estado:"Cliente insertado exitosamente"});
    }catch(error){
        console.log(error);
    }
});

// Para eliminar un documento de la base de datos de Mongo
router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    try{
        const clienteDB = await Cliente.findOneAndDelete({codigo_cliente:id});
        if(clienteDB){
            res.json({estado:true,
                    mensaje:"Cliente eliminado de la base de datos"
            })
        }
        else{
            res.json({estado:false,
                    mensaje:"No se puedo el cliente solicitado"
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
        const clienteDB = await Cliente.findOneAndUpdate({codigo_cliente:id}, body, {useFindAndModify:false});
        res.json({
            estado:true,
            mensaje:"El cliente ha sido actualizado correctamente"
        })
    }catch(error){
        console.log(error);
        res.json({
            estado:false,
            mensaje:"Los datos del cliente no han sido actualizados"
        })
    }
});

module.exports=router;