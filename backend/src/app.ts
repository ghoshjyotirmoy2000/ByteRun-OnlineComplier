


// express server 
import express from "express";
import { redisClient } from "./config/redis";

const app = express();

app.use(express.json());

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

// starting server
async function startServer() {
  try {
    await redisClient.connect();

    console.log("✅ Connected to Redis");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();