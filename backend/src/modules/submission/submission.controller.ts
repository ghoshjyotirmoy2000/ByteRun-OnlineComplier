import { Request, Response } from "express";
import submissionService from "./submission.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";

class SubmissionController {

  public async sendCodetoQueue(req: Request, res: Response) {
    const data = req.body;
    const userId = req.user?.id;

    // 1. WRITE DATA IN DB AT PENDING STATE

    const submission = await submissionService.sendCodetoQueue(
      userId!,
      data,
    );

    if(!submission){
        throw new ApiError(404 , "Submission not found")
    }


    // 2. SEND DATA TO THE REDIS QUEUE , WRITE DB STATUS - QUEUED

    await submissionService.AddtoQueueService(userId! , submission.id , data)

    return res
      .status(201)
      .json(new ApiResponse(201, "Submitted successfully", submission.id));
  }
}


export default new SubmissionController()
