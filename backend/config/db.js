const mongoose = require("mongoose")
require("dotenv").config()
const dbUri = process.env.MONGO_URI

const dbConnection = async()=>{
    try {
        await mongoose.connect(dbUri)
        console.log("connected to db")
    } catch (error) {
        console.log("error while connecting to db",error)
    }
}

module.exports = dbConnection