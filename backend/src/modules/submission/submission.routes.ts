import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { CodeSchema } from "./submission.validation";
import { validateRequest } from "../../middleware/validate";
import submissionController from "./submission.controller";
import { asynchanlder } from "../../middleware/asynchandler";

const router = Router();

router.post("/run-code" , authenticate , validateRequest(CodeSchema) , asynchanlder(submissionController.runCodeController))


export default router;