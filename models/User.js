const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        sparse:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

userSchema.pre('save',async function(next) { 
    
     let user = this;

     let saltrounds = 10;

     if (!user.isModified('password')) return next();

     try{
        const hashedPassword = await bcrypt.hash(user.password,saltrounds);
        this.password = hashedPassword;
        next();
     }
     catch(error){
        console.error("Error Hashing Password",error);
        next(error);
     }

});

module.exports = mongoose.model('User',userSchema);