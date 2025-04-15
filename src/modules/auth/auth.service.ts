import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { ILoginType } from "./auth.type";
import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "abcd";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "abcde";

const loginUser = async (payload: ILoginType) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: { email: payload.email, status: UserStatus.ACTIVE },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Invalid password");
  }

  const tokenPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = jwtHelpers.generateToken(
    tokenPayload,
    accessTokenSecret,
    "5m"
  );
  const refreshToken = jwtHelpers.generateToken(
    tokenPayload,
    refreshTokenSecret,
    "7d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = jwtHelpers.verifyToken(token, refreshTokenSecret);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }

  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const newAccessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    accessTokenSecret,
    "5m"
  );

  return {
    accessToken: newAccessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authService = {
  loginUser,
  refreshToken,
};
