var express = require('express');
var router = express.Router();
var Customer = require('../models/customer');
var mongoose  = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

router.post('/',(req,res)=>{
    index=req.body.ind;
    items=req.body.arr;
    amount=req.body.amount;
    Customer.updateOne({ShopName:index},{$push:{Items:items}},(err, docs) => {
      if (err) {
        console.log('Error while getting customers from DB in /customers ' + err);
      } else {
        Customer.find({ShopName:index},(err,docs)=>{
          if(err)
            console.log(err);
          else{
            docs[0].Amount=docs[0].Amount+amount;
            Customer.updateOne({ShopName:index},{Amount:docs[0].Amount},(err,docs)=>{
              if(err)
                console.log(err);
              else{
                Customer.find({ShopName:index},(err,docs)=>{
                  if(err)
                    console.log(err);
                  else{
                    console.log(docs);
                }
            })
          }
          console.log(JSON.stringify(docs));
          })
        }
      })
    }
  })
})
router.post('/delete',(req,res)=>{
    Arr=req.body.Arr;
    var updation = function(A){
      var ids=A.split('+');
      Customer.update({_id:ids[0]},{$pull:{Items:{_id:ids[1]}}},(err,docs)=>{
        if(err)
          console.log(err);
        else{
          Customer.find({_id:ids[0]},(err,docs)=>{
            if(err)
              console.log(err);
            else{
              docs[0].Amount=docs[0].Amount-ids[2]*ids[3];
              Customer.update({_id:ids[0]},{Amount:docs[0].Amount},(err,docs)=>{
                if(err)
                  console.log(err);
                else{
                  Customer.find({_id:ids[0]},(err,docs)=>{
                    if(err)
                      console.log(err);
                    else{
                      console.log(JSON.stringify(docs));
                  }
              })
            }
          })
        }
      })
    }
  })
  }
    for(var i=0;i<Arr.length;i++){
      updation(Arr[i]);
    }
})

module.exports = router;