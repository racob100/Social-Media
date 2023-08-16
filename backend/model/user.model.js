const mongoose = require("mongoose")
const addressSchema = mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postal_code: String,
   
});
const userSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        
    },
    middle_name:{
        type:String,
        
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile_number:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
        minlength: 8,
        maxlength: 100,
        
    },
    current_address: addressSchema,
    permanent_address: addressSchema,
})

const User = mongoose.model("user",userSchema)
module.exports = {User}