var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ProductSchema=new Schema({
    Name:String,
    Price:Number
});
module.exports=mongoose.model('Product',ProductSchema);