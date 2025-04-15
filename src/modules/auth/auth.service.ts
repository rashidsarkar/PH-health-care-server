import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { ILoginType } from "./auth.type";
import jwt from "jsonwebtoken";

const loginUser = async (payload: ILoginType) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: { email: payload.email },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  console.log(isCorrectPassword);

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "asdcv1287",
    { expiresIn: "15m" }
  );
  return accessToken;
};

export const authService = {
  loginUser,
};
