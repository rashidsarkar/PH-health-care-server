import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";
const router = express.Router();

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};
router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getAdminByid);
router.patch("/:id", validateRequest(update), adminController.updatedAdminByid);
router.delete("/:id", adminController.deleteAdminByid);
router.delete("/soft/:id", adminController.softDeleteAdminByid);
export const adminRoutes = router;
