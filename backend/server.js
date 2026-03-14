const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authMiddleware = require("./middlewares/authMiddleware");
const resumeRoutes = require("./routes/resume");
app.use(cors({
  origin: "http://localhost:5173", // your frontend dev URL
  credentials: true
}));

//middlewares
app.use(express.json());

//routes
const userRoute = require("./routes/user");
const questionRoute = require("./routes/question");
const interviewRoute = require("./routes/interview");


//Routes
app.use("/api/auth",userRoute);
app.use("/api/questions",questionRoute);
app.use("/api/interview",interviewRoute);
app.use("/resume", resumeRoutes);

//test route
app.get("/", (req,res)=> {
    res.json({message:"Server is running fine"});
});
//test middlware route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
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