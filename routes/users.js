var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose  = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

router.post('/register',async(req,res)=>{
  var user=new User({
    username:req.body.username,
    password:req.body.password,
    ShopName:""
  })
  try {
    const existingUser = await User.findOne({username:req.body.username});

    if (existingUser) {
      res.status(409).send("User already exists");
      return;
    }
  user.save(function(err,NewU){
    if(err)
      console.log(err);
    else{
      let payload={subject:NewU._id}
      let token=jwt.sign(payload,'secretkey');
      console.log(NewU);
      res.status(200).send({token,NewU});
    }
  })
}
  catch(err){
    console.log(err);
  }
});
router.post('/login',(req,res)=>{
      User.findOne({username:req.body.username},(err,docs)=>{
        if(err)
        console.log(err);
        else{
        if(!docs)
          res.status(401).send('Invalid Username');
        else{
          if(docs.password!==req.body.password)
          res.status(402).send('Invalid Password');
          else{
            let payload={subject:docs._id}
            let token=jwt.sign(payload,'secretkey');
            res.status(200).send({token,docs});
          }
        }  
      }
    })
});
router.post('/shopreg',(req,res)=>{
  console.log(req.body);
  User.update({username:req.body.user},{$set:{ShopName:req.body.shop}},(err,docs)=>{
    if(err)
    console.log(err);
    else
    console.log(docs);
  })
})
module.exports = router;
