import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { adminService } from "./admin.service";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllAdmin(req.query);
    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Error occurred while retrieving admins",
      error: error?.message,
    });
  }
};

export const adminController = {
  getAllAdminFromDB,
};
