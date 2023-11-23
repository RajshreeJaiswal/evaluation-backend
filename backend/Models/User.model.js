const mongoose=require('mongoose');
const UserSchema=mongoose.Schema({
   // name, email, password, gender, country
   name:{type:String,require:true},
   email:{type:String,require:true,unique: true},
   password:{type:String,require:true},
   gender:{type:String,require:true},
   country:{type:String,require:true},
})

const UserModel=mongoose.model("user",UserSchema);
module.exports={
    UserModel
}