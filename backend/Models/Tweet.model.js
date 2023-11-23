const mongoose=require('mongoose');
//      -  title body category (any one of these categories - education, development, fun, sports)

const TweetSchema=new mongoose.Schema({
    Title :{type:String,require:true},
    Body:{type:String},
    Category:{type:String,enum: ["education", "development", "fun", "sports"]},
    user_Id:{type:String,require:true},
})

const TweetModel=mongoose.model("tweet",TweetSchema);

module.exports={
    TweetModel
};