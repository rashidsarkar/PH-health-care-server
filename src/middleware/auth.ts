import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../helpers/jwtHelpers";
import config from "../config";
import ApiError from "../errors/ApiError";
import status from "http-status";
import { Secret } from "jsonwebtoken";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log(token);
      if (!token) {
        // return res.status(401).json({ message: "Unauthorized: No token provided" });
        throw new ApiError(
          status.UNAUTHORIZED,
          "Unauthorized: Token not found"
        );
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );
      //   console.log(verifiedUser);
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          status.FORBIDDEN,
          "Unauthorized: User role not permitted"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
