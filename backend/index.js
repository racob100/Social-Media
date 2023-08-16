const express = require('express')
require('dotenv').config()
const cors  = require('cors')
const { connection } = require('./config/db')
const {userRouter} = require("./routes/user.route.js")
const app = express()
app.use(express.json())
app.use(cors())
app.get("/",async(req,res)=>{
    res.send("Home")
})
app.use("/user",userRouter)
const port  = process.env.PORT || 5050
app.listen(port,async()=>{
    console.log("waiting for connection...")
    try {
        await connection
        console.log("Connected To DB")
        
    } catch (error) {
        console.log(error)
        
    }
    console.log(`Server is running at ${port}`)
})