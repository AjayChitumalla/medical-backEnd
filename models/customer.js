var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var CustomerSchema=new Schema({
    ShopName:String,
    Amount:Number,
    Items:[{
        Name:String,
        Quantity:Number,
        Price:Number,
        Time:String
    }]
});
module.exports=mongoose.model('Customer',CustomerSchema);