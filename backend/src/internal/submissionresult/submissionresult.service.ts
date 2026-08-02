import { prisma } from "../../config/prisma";
import { SubmitResultSchemaDto } from "./submissionresult.validation";

class SubmitResultService {
    public async submitResult(submissionId : string , data : SubmitResultSchemaDto) {
        const submission = await prisma.submission.update({
            where : {id : submissionId},
            data : {
                error : data.error,
                executionTime : data.executionTime,
                output : data.output,
                status : "COMPLETED"
            },
        })

        return submission;
    }
}

export default new SubmitResultService()