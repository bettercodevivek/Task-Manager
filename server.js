require('dotenv').config();

const express = require('express');

const {ConnectDB} = require('./config/db');

const app = express();

const PORT = process.env.PORT;

app.get('/health',(req,res)=>{
    res.status(200).json({message:"Server Up and Running !"})
});


const startServer = async() => {
    try{
      await ConnectDB();
      app.listen(PORT,()=>{
        console.log(`Server Started on PORT : ${PORT}`)
      })
    }
    catch(error){
     console.error("Failed to Start the Server",error);
     process.exit(1);
    }
}

startServer();