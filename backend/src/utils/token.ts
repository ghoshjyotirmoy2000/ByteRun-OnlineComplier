import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const signRefreshToken = (payload: Pick<JwtPayload, "id">) => {
  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  return { token, expiresAt };
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
