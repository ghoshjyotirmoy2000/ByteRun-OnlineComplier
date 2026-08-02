import { Request, Response } from "express";
import userService from "../user/user.service";
import authService from "./auth.service";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  type JwtPayload,
} from "../../utils/token";

const isProd = process.env.NODE_ENV === "production";

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
    
  public async RegisterUserController(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const [existingEmail, existingUsername] = await Promise.all([
      userService.findUserByEmail(email),
      userService.findUserByUsername(username),
    ]);

    if (existingEmail) {
      throw new ApiError(409, "Email already exists");
    }

    if (existingUsername) {
      throw new ApiError(409, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authService.RegisterUserService({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User created successfully", user));
  }

  public async LoginUserController(req: Request, res: Response) {
    const { email, password } = req.body;
    const existingUser = await userService.findUserByEmail(email);
    if (!existingUser) {
      throw new ApiError(404, "user not found");
    }
    const checkPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!checkPassword) {
      throw new ApiError(401, "Incorrect passeword");
    }

    const payload: JwtPayload = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };

    const accessToken = signAccessToken(payload);
    const { token: refreshToken, expiresAt } = signRefreshToken({
      id: existingUser.id,
    });

    await authService.saveRefreshToken(
      existingUser.id,
      hashToken(refreshToken),
      expiresAt,
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      }),
    );
  }

  public async RefreshTokenController(req: Request, res: Response) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    let decoded: JwtPayload & { id: string };
    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_PRIVATE_KEY!,
      ) as JwtPayload & { id: string };
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const tokenHash = hashToken(incomingRefreshToken);
    const storedToken = await authService.findValidRefreshToken(tokenHash);
    if (!storedToken) {
      throw new ApiError(401, "Refresh token revoked or not recognized");
    }

    const user = await userService.findUserById(decoded.id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    await authService.revokeRefreshToken(tokenHash);

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = signAccessToken(payload);
    const { token: newRefreshToken, expiresAt } = signRefreshToken({
      id: user.id,
    });

    await authService.saveRefreshToken(
      user.id,
      hashToken(newRefreshToken),
      expiresAt,
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, "Token refreshed", null));
  }

  public async MeController(req: Request, res: Response) {
    const user = await userService.findUserById(req.user!.id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    return res.status(200).json(
      new ApiResponse(200, "OK", {
        id: user.id,
        email: user.email,
        username: user.username,
      }),
    );
  }

  public async LogoutUserController(req: Request, res: Response) {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (incomingRefreshToken) {
      await authService.revokeRefreshToken(hashToken(incomingRefreshToken));
    }

    res.clearCookie("accessToken", accessTokenCookieOptions);
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    return res.status(200).json(new ApiResponse(200, "Logged out", null));
  }
}

export default new AuthController();
