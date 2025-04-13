import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { adminController } from "./admin.controller";
const router = express.Router();

router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getAdminByid);
router.patch("/:id", adminController.updatedAdminByid);
router.delete("/:id", adminController.deleteAdminByid);
router.delete("/soft/:id", adminController.softDeleteAdminByid);
export const adminRoutes = router;
