var express = require('express');
var router = express.Router();

const { Sequelize, Op } = require('sequelize');
const Foto = require('../models').foto;
const Etiqueta = require('../models').etiqueta;  

const path = "public/images/"

const multer = require("multer");
const storage = multer.diskStorage(
    {
        destination: path,
        filename: function ( req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);
const upload = multer({ storage: storage })

router.get('/findAll/json', function(req, res, next) {  

  
  Foto.findAll({  
      attributes: { exclude: ["updatedAt"] } ,
      include: [{
          model: Etiqueta,
          attributes: ['texto'],
          through: {attributes: []}
        }], 
  })  
  .then(fotos => {  
      res.json(fotos);  
  })  
  .catch(error => res.status(400).send(error)) 

});

router.get('/findAll/view', function(req, res, next) {  

  
  Foto.findAll({  
      attributes: { exclude: ["updatedAt"] }  
  })  
  .then(fotos => {  
      res.render('fotos', { title: 'Fotos', arrFotos: fotos });  
  })  
  .catch(error => res.status(400).send(error)) 

});


router.get('/findAllByRate/json', function(req, res, next) {  

  let lower = parseFloat(req.query.lower);
  let higher = parseFloat(req.query.higher);

  Foto.findAll({
    attributes: { exclude: ["updatedAt"] } ,
    include: [{
      model: Etiqueta,
      attributes: ['texto'],
      through: {attributes: []}
    }], 
    where: { 
      calificacion: { 
        [Op.between]: [lower, higher]
      }
    }
  })  
  .then(fotos => {  
    res.json(fotos);  
  })  
  .catch(error => res.status(400).send(error)) 

});

router.get('/findAllById/:id/json', function(req, res, next) {  

  let id = parseInt(req.params.id);

  Foto.findAll({  
      attributes: { exclude: ["updatedAt"] } ,
      include: [{
          model: Etiqueta,
          attributes: ['texto'],
          through: {attributes: []}
        }], 
      where: { 
        [Op.and]: [
          {id: id}
        ]
      }
  })  
  .then(fotos => {  
      res.json(fotos);  
  })  
  .catch(error => res.status(400).send(error)) 

});
router.post('/save', upload.single('archivo'),  function(req, res, next) {
  let {titulo, descripcion, calificacion,ruta} = req.body;
      
  Foto.create({
    titulo: titulo,
    descripcion: descripcion,
    calificacion: parseFloat(calificacion),
    ruta: path+ruta,
    createdAt: new Date(),  
    updatedAt: new Date()  
  })
  .then(foto => {
    res.json(foto);
  })
  .catch(error => res.status(400).send(error))

});

router.put('/update/:id', upload.single('archivo'),  function(req, res, next) {
  let id = parseInt(req.params.id);
  let {titulo, descripcion, calificacion,ruta} = req.body;
  Foto.update({
    titulo: titulo,
    descripcion: descripcion,
    calificacion: parseFloat(calificacion),
    ruta: path+ruta,
    updatedAt: new Date()
  }, {
    where: {
      id: id
    }
  })
  .then(foto => {
    res.json(foto);
  })
  .catch(error => res.status(400).send(error))

});
router.delete('/delete/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  Foto.destroy({
    where: {
      id: id
    }
  })
  .then(foto => {
    res.json(foto);
  })
  .catch(error => res.status(400).send(error))
  
});

module.exports = router;