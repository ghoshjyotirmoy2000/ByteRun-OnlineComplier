import express from "express";
import cors from "cors";
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

app.use(errorhanlder)

export default app;
