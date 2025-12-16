const express = require ('express');
const {dirname} = require ('path');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;

// Esto es muy importante para el pase de datos entre los modulos y los componentes 

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

//Configurar las cabeceras y los CORS
app.use((req, res, next)=>{
    res.header ('Access-Control-Allow-Origin','*');
    res.header ('Access-Control-Allow-headers','Authorization, X API-KEY,Origin,X-Request-With,Content-Type',
        'Accept','Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Generamos la conexion a la base de datos de Mongo

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/eco_tours',{useNewUrlParser:true,UseUnifiedTopology:true})
.then(()=>console.log('La base de datos de mongodb ha sido conectada correctamente'))
.catch(e => console.log(e));

//Ruta de la API
app.use('/auth', require('./router/Auth'));
app.use('/usuarios', require('./router/Usuarios'));
app.use('/clientes', require('./router/Clientes'));

app.listen(port,()=>{
    console.log('El servidor esta activo y escuchando por el puerto',port);
});