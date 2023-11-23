const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()
const cors=require('cors')
const { connection } = require("./config/db")
const { UserModel } = require("./Models/User.model")
const { authentication } = require("./middleware/Authentication.middleware")
const { TweetModel } = require("./Models/Tweet.model")


const app=express()
app.use(express.json())
app.use(cors({
    origin:"*"
}))

app.get("/",(req,res)=>{
    res.send({message:"base API endpoint"})
})
// 1. Registering
app.post("/signup", async(req,res)=>{
    const{name, email, password, gender, country}=req.body;
    const is_user=await UserModel.findOne({email})
    if(is_user){
        res.send({message:"Email already registered, SignIn first"})
    }
    bcrypt.hash(password ,3 , async function(err,hash){
        const new_user=new UserModel({
            email,
            password: hash,
            name,
            gender,
            country,
        })
        await new_user.save()
        res.send({message:"Sign up successful"})
    })
})

//2. Logging in
app.post("/login", async(req,res)=>{
    const{email,password}=req.body;
    const is_user=await UserModel.findOne({email})
    if(is_user){
        const hashed_pwd=is_user.password
        bcrypt.compare(password,hashed_pwd,function(err,result){
            if(result){
                const token=jwt.sign({userID:is_user._id},process.env.SECRET_KEY)
                res.send({message:"Login successful", token:token})
            }
            else{
                res.send({message:"Sign up first"})
            }
        })
    }
})


app.use(authentication)
//3. Creating a tweet
app.post("/tweets/create",async(req,res)=>{
    const {Title, Body, Category}=req.body;
    const userID=req.userID
    const user=await UserModel.findOne({userID})
    console.log(userID)
    const new_tweet=new TweetModel({
        Title,
        Body,
        Category, 
        user_Id:user._id
    })
    try {
       await new_tweet.save()
       return res.send({message:"Tweet added successfully"}) 
    } catch (error) {
        console.log(error)
        res.send({message:"unable to add the tweet, something went wrong"})
    }
})

//4. Reading all tweets (based on category filter too, for eg : /tweets?category=sports should only give all tweets that belong to that category)
app.get("/tweets",async(req,res)=>{
    try {
        const tweets=await TweetModel.find()
        res.send({tweets})
    } catch (error) {
        console.log(error)
        res.send({message:"Something went wrong, please try again"})
    }
})

//5. Updating a tweet
app.patch("/tweets/:tweetsId",async(req,res)=>{
    const {tweetId}=req.params
    try {
        const tweets=await TweetModel.findOneAndUpdate({_id:tweetId,user_Id:req.userID})
        if(tweets){
            res.send({message:"Tweet updated successfully"})
        }else{
            res.send({message:"Tweet not found or you are not authorized to this operation"})
        }
    } catch (error) {
        console.log(error)
        res.send({message:"unable to update the tweet, something went  wrong"})
    }
})

// 6. Deleting a tweet
app.delete("/tweets/:tweetsId",async(req,res)=>{
    const {tweetId}=req.params
    try {
        const tweets=await TweetModel.findOneAndDelete({_id:tweetId,user_Id:req.userID})
        if(tweets){
            res.send({message:"Tweet deleted successfully"})
        }else{
            res.send({message:"Tweet not found or you are not authorized to this operation"})
        }
    } catch (error) {
        console.log(error)
        res.send({message:"unable to delete the tweet, something went  wrong"})
    }
})

const port=process.env.PORT 
app.listen(port,async()=>{
    try {
        await connection
        console.log("connected to MONGODB successfully")
    } catch (error) {
        console.log("error while connecting to MONGODB")
        console.log(error)
    }

    console.log(`Listening on port ${port}`)
})