const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const app = express()

const routeUrls = require('./Router/routes')
mongoose.connect(process.env.DATABASE_URL,(err)=>{
    if(err){
        console.log(err)
    }

    else{
        console.log('Database Connected')
    }
})





app.use(express.json())
app.use(cors())
app.use('/api', routeUrls)




app.listen(5000, ()=>{
    console.log('Server is running')
})