import { Request, Response } from "express";
import submissionresultService from "./submissionresult.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { redisPublisher } from "../../config/redisPublisher";

class SubmitResultController {
  public async submitResult(req: Request, res: Response) {
    const data = req.body;
    const { submissionId } = req.params as { submissionId: string };
    const submission = await submissionresultService.submitResult(
      submissionId,
      data,
    );

    await redisPublisher.publish(
      "submission.completed",
      JSON.stringify({
        submission
      }),
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Ran successfully", submission.id));
  }
}

export default new SubmitResultController();
