import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../shared/pick";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, [
      "name",
      "email",
      "searchTerm",
      "contactNumber",
    ]);
    const result = await adminService.getAllAdmin(filter);
    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: result,
    });
  } catch (error: any) {
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
