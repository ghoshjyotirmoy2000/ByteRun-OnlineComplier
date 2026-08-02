import { prisma } from "../../config/prisma";
import { redisClient } from "../../config/redisQueue";
import { CodeSchemaDto } from "./submission.validation";

class SubmissionService {
  public async SubmitCodeService(userId: string, data: CodeSchemaDto) {
    const { language, input } = data;
    const submission = await prisma.submission.create({
      data: { userId, language, input, status: "PENDING" },
      select: { id: true },
    });
    return submission.id;
  }

  public async AddtoQueueService(
    userId: string,
    submissionId: string,
    data: CodeSchemaDto,
  ) {
    await redisClient.lPush(
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
