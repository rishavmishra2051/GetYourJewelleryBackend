const mongoose = require('mongoose')


const { Schema } = mongoose;

const categorySchema = new Schema({
    CategoryName:{
        type:String,
        required:true
    }
  });

  module.exports = mongoose.model('jewel_category',categorySchema)