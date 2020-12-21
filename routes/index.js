const express = require('express');
const path = require('path');
const axios = require('axios');
const router = express.Router();
const comunas = require(path.join(__dirname+'/comunas.js'))


// Obtiene Listado de Comunas
router.get('/comunas', (req,res)=>{
    res.json(comunas)
});

// Obtener Farmacias filtrada por Nombre y Comuna
router.get('/farmacias/',getFarmacias(), (req,res)=>{
    const {nombre_local, comuna} = req.query
    let response = res.getFarmacias;
    if(nombre_local){
        response = response.filter( item => {
            const words = nombre_local.split(" ");
            const match = words.some(word => {
            return (item.nombre_local.trim().includes(word.toUpperCase()))
            })
            return match == true 
        });
    }
    if(comuna) response = response.filter(item => item.comuna == comuna.toUpperCase());
    res.json(response)
});

// Farmacias con nueva schema
function getFarmacias (){
    return  (req, res, next) => {
        axios.get('https://farmanet.minsal.cl/maps/index.php/ws/getLocalesRegion?id_region=7').then( response => {
            let farmacias =  response.data.map( item => {
                let obj= {
                    'comuna': item.comuna_nombre, 
                    'nombre_local': item.local_nombre,
                    'direccion': item.local_direccion,
                    'telefono': item.local_telefono,
                    'latitud': item.local_lat,
                    'longitud': item.local_lng
                };
                return obj;
            })
            res.getFarmacias = farmacias;
            next()
        }).catch(error =>{
            console.log("Catch Error: ",error)
        })
    }
}

module.exports = router;