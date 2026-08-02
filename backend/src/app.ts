import express from "express";
import cors from "cors";
import { redisClient } from "./config/redisQueue";
import { errorhanlder } from "./middleware/errorhandler";
import authRoutes from "./modules/auth/auth.routes";
import submissionRoutes from "./modules/submission/submission.routes";
import submissionResultRoutes from "./internal/submissionresult/submissionresult.routes";


import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/submission" , submissionRoutes)

// internal apis
app.use("/api/v1/internal" , submissionResultRoutes)

app.post("/submission" , (req, res) => {
    const userId = req.body.userId
    const questionId = req.body.questionId
    const code = req.body.code
    const language = req.body.language
    // 1.put the entry in DB

    // 2.add to queue
    redisClient.lPush("problems" , JSON.stringify({userId , questionId , code , language }));

    res.json({
        message : "processing"
    })


})  

app.post("/submission/:submissionId" , (req , res) => {
    
})

app.use(errorhanlder)

export default app;
