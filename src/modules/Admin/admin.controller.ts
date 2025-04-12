import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../shared/pick";
import { adminFilterableFields } from "./admin.const";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminFilterableFields);
    const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(option);
    console.log(filter);
    const result = await adminService.getAllAdmin(filter, option);
    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      meta: result.meta,
      data: result.data,
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
