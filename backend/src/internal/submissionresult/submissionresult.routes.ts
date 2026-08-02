import Router from "express";
import submissionresultController from "./submissionresult.controller";
import { asynchanlder } from "../../middleware/asynchandler";
import { authenticateInternalApi } from "../internal-auth.middleware";
import { validateRequest } from "../../middleware/validate";
import { SubmitResultSchema } from "./submissionresult.validation";

const router = Router();

router.post('/submission-result/:submissionId', authenticateInternalApi , validateRequest(SubmitResultSchema) , asynchanlder(submissionresultController.submitResult))

export default router;
