import { prisma } from "../../config/prisma";
import { redisQueue } from "../../config/redisQueue";
import { CodeSchemaDto } from "./submission.validation";

class SubmissionService {
  public async sendCodetoQueue(userId: string, data: CodeSchemaDto) {
    const { language, input } = data;
    const submission = await prisma.submission.create({
      data: { userId, language, input, status: "PENDING" }
    });
    return submission;
  }

  public async AddtoQueueService(
    userId: string,
    submissionId: string,
    data: CodeSchemaDto,
  ) {
    await redisQueue.lPush(
      "problems",
      JSON.stringify({ userId, submissionId, ...data }),
    );
    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: "QUEUED",
      },
    });
  }
}

export default new SubmissionService();
