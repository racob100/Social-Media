const express = require("express")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userRouter = express.Router()
const {User} = require("../model/user.model.js")
const Redis = require("ioredis")
require("dotenv").config()
const {client} = require("../config/redis")
userRouter.post("/register",async(req,res)=>{
    const {first_name,middle_name,last_name,email,mobile_number,password, current_address, permanent_address} = req.body
    try{
        const user =await User.findOne({mobile_number})
        if(user){
            res.status(401).send({msg:"Please use a different mobile number"})
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const new_user = new User({first_name,middle_name,last_name,email,mobile_number,password:hashedPassword, current_address, permanent_address})
       const savedUser = await new_user.save()
       res.status(200).send({msg:"Successfully Registered"})
    }
    catch(error){
        res.status(401).send({msg:error.message})
    }
})
userRouter.post("/login",async(req,res)=>{
    const { mobile_number, password } = req.body;
    try {
       
        const user = await User.findOne({ mobile_number });
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

      
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        
        const token = jwt.sign({ userId: user._id }, process.env.token, { expiresIn: "1h" });
        const refreshToken =jwt.sign({ userId: user._id }, process.env.refreshToken, { expiresIn: "7d" });
        client.mset("token",token,'EX', 24 * 60 * 60,(err,reply)=>{
            if (err) {
                console.error("Error storing access token in Redis:", err);
                return res.status(500).json({ msg: "Internal server error" });
            }
            else{
                console.log(reply)
            }
    
        })
        client.mset("refreshToken",refreshToken,'EX',7*24*60*60,(err,reply)=>{
            if (err) {
                console.error("Error storing access token in Redis:", err);
                return res.status(500).json({ msg: "Internal server error" });
            }
            else{
                console.log(reply)
            }
        })
        res.json({ msg: "Login successful", token,refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
userRouter.get("/logout",(req,res)=>{
    client.get("token").then((result) => {
         console.log(result); // Prints "value"
         const decoded = jwt.verify(result,process.env.token)
    
     
         if(!decoded){
               res.status(400).send({"msg":"Access not granted"})
         }
         client.mset("blackList",decoded.userId)
         res.status(200).send("Logged Out")
       });
   })
  
module.exports = {userRouter}