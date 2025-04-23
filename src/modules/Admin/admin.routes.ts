import { PrismaClient, UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middleware/validatedRequest";
import { adminValidationSchema } from "./admin.validation";
import auth from "../../middleware/auth";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getAllAdminFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAdminByid
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidationSchema.update),
  adminController.updatedAdminByid
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.deleteAdminByid
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.softDeleteAdminByid
);
export const adminRoutes = router;
