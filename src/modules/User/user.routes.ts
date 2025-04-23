import express, { Application, NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
const router = express.Router();
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log(token);
      if (!token) {
        // return res.status(401).json({ message: "Unauthorized: No token provided" });
        throw new Error("Unauthorized: Token not found");
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as string
      );
      console.log(verifiedUser);
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("Unauthorized: User role not permitted");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
router.post("/", auth("ADMIN", "super"), userController.createAdmin);
export const userRoutes = router;
