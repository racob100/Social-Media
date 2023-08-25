require("dotenv").config()
const Redis = require("ioredis")
let configuration = {
    host:"redis-13932.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    port:13932,
    username:"default",
    password: process.env.Redis_Lab_Pass
}
const client = new Redis(configuration)

module.exports = {client}