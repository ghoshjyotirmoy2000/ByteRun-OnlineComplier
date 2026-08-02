import { Request, Response } from "express";
import submissionService from "./submission.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { redisClient } from "../../config/redisQueue";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

class SubmissionController {

  public async runCodeController(req: Request, res: Response) {
    const data = req.body;
    const userId = req.user?.id;

    // 1. WRITE DATA IN DB USING PENDING STATE

    const submissionId = await submissionService.SubmitCodeService(
      userId!,
      data,
    );

    if(!submissionId){
        throw new ApiError(404 , "Submission not found")
    }


    // 2. SEND DATA TO THE REDIS QUEUE , WRITE DB STATUS - QUEUED

    await submissionService.AddtoQueueService(userId! , submissionId , data)

    // 3. AFTER REDIS COMPLIE THE DATA TAKE RETURN FROM REIDS WORKER 
    // 4. WRITE DB THE OUTPUT WITH COMPLETED STATUS AND PUSBLIS A REDIS EVENT 


    return res
      .status(201)
      .json(new ApiResponse(201, "Submitted successfully", submissionId));
  }
}


export default new SubmissionController()
