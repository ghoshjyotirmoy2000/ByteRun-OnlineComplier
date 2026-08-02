import { createWebSocketServer } from "./websocket/server";
import { startSubmissionResultSubscriber } from "./pubsub/submissionSubscriber";

const PORT = Number(process.env.PORT);

createWebSocketServer(PORT);
startSubmissionResultSubscriber();
