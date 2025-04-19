import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { ILoginType } from "./auth.type";
import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

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
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_secret_expires_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
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
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
    // console.log(decodedData);
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
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_secret_expires_in as string
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
