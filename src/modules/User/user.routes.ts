import express, { Application, NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import auth from "../../middleware/auth";
const router = express.Router();

router.post("/", auth("ADMIN", "super"), userController.createAdmin);
export const userRoutes = router;
