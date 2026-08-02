import { ResgisterUserDto } from "./auth.validation";
import { prisma } from "../../config/prisma";

class AuthService {
  public async RegisterUserService(data: ResgisterUserDto) {
    console.log(data);
    const user = await prisma.user.create({ data, select: { id: true } });
    return user;
  }

  public async saveRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  public async findValidRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  public async revokeRefreshToken(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}


export default new AuthService
