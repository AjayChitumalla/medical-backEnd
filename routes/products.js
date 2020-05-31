var express = require('express');
var router = express.Router();
var Product  = require('../models/product');
var Customer = require('../models/customer');
var mongoose  = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

function verifytoken(req,res,next){
    if(!req.headers.authorization){
      return res.status(401).send("Unauthorized!");
    }
    let token=req.headers.authorization.split(' ')[1];
    if(token === 'null'){
      return res.status(401).send("Unauthorized!");
    }
    let payload=jwt.verify(token,'secretkey');
    if(!payload){
      return res.status(401).send("Unauthorized!");
    }
    req.userId=payload.subject;
    next();
}

router.get('/',verifytoken, (req, res) => {
    Product.find({},(err, docs) => {
      if (err) {
        console.log('Error while getting products from DB in /products ' + err);
        res.json({
          error: err
        });
      } else {
          res.json(docs);
      }
    });
  })
router.post('/',async(req,res)=>{
    var product=new Product({
      Name:req.body.Name,
      Price:req.body.Price
    })
    try {
      const existingProduct = await Customer.findOne({Name:req.body.Name});
  
      if (existingProduct) {
        return console.log("Product already exists!");
      }
    product.save(function(err,NewP){
      if(err)
        console.log(err);
      else
        console.log(NewP);
    })
  }
  catch(err){
    console.log(err);
  }
})

module.exports = router;