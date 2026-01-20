const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//test route
app.get("/", (req,res)=> {
    res.json({message:"Server is running fine"});
});

//connect DB and start server
const PORT  = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("MongoDB connected");
        app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
    })
    .catch((err)=> console.log(err));