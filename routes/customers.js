var express = require('express');
var router = express.Router();
var Customer  = require('../models/customer');
var User = require('../models/user');
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
    Customer.find({},(err, docs) => {
      if (err) {
        console.log('Error while getting customers from DB in /customers ' + err);
        res.json({
          error: err
        });
      } else {
          res.json(docs);
      }
    });
  })
router.post('/',async(req,res)=>{
    var customer=new Customer({
      ShopName:req.body.ShopName,
      Amount:0
    })
    try {
      const existingCustomer = await Customer.findOne({ShopName:req.body.ShopName});
  
      if (existingCustomer) {
        return console.log("Customer already exists!");
      }
    customer.save(function(err,NewC){
      if(err)
        console.log(err);
      else
        res.status(200).send(NewC);
    })
  }
  catch(err){
    console.log(err);
  }
});
router.post('/myorders',(req,res)=>{
    if(req.body.ShopName){
    Customer.find({ShopName:req.body.ShopName},(err,docs)=>{
      if(err)
      console.log(err);
      else{
        res.send(docs[0]);
      }
    })
  }
})
router.delete('/:shopId',(req,res)=>{
  var shop;
  Customer.find({_id:req.params.shopId},(err,docs)=>{
    if(err)
      console.log(err);
    else
      shop=docs[0].ShopName;
  })
  Customer.findByIdAndRemove((req.params.shopId),(err,docs)=>{
    if(err)
    console.log(err);
    else{
      console.log(shop);
      User.find({ShopName:shop},(err,docs)=>{
        if(err)
          console.log(err);
        else{
          if(docs.length==0)
          return;
          var user=docs[0]._id;
          User.findByIdAndRemove(user,(err,docs)=>{
            if(err)
            console.log(err);
            else
            console.log(user);
          })
        }
      })
    }
  });
});
router.put('/:shopId',(req,res)=>{
  var shop;
  Customer.find({_id:req.params.shopId},(err,docs)=>{
    if(err)
      console.log(err);
    else{
      shop=docs[0].ShopName;
    }
  })
  Customer.findByIdAndUpdate((req.params.shopId),{ShopName:req.body.newname},(err,docs)=>{
    if(err)
    console.log(err);
    else{
      console.log(shop);
      User.find({ShopName:shop},(err,docs)=>{
        if(err)
          console.log(err);
        else{
          if(docs.length==0)
          return;
          console.log(docs);
          var user=docs[0]._id;
          User.findByIdAndUpdate(user,{ShopName:req.body.newname},(err,docs)=>{
            if(err)
            console.log(err);
            else
            console.log(user);
          })
        }
      })
    }
  });
});
module.exports = router;