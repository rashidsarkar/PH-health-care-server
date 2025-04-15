import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middleware/validatedRequest";
import { adminValidationSchema } from "./admin.validation";
const router = express.Router();

router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getAdminByid);
router.patch(
  "/:id",
  validateRequest(adminValidationSchema.update),
  adminController.updatedAdminByid
);
router.delete("/:id", adminController.deleteAdminByid);
router.delete("/soft/:id", adminController.softDeleteAdminByid);
export const adminRoutes = router;
