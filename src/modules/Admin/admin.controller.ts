import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../shared/pick";
import { adminFilterableFields } from "./admin.const";
import { handlePrismaError } from "../../utils/handlePrismaError";
import { sendResponse } from "../../utils/sendResponse";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminFilterableFields);
    const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(option);
    console.log(filter);
    const result = await adminService.getAllAdmin(filter, option);
    // res.status(200).json({
    //   success: true,
    //   message: "Admins retrieved successfully",
    //   meta: result.meta,
    //   data: result.data,
    // });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    handlePrismaError(error, res);
  }
};
const getAdminByid = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await adminService.getAdminByIdFromDb(id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin retrieved successfully",
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins retrieved successfully",
      data: result,
    });
  } catch (error) {
    handlePrismaError(error, res);
  }
};
const updatedAdminByid = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await adminService.updatedAdminByIdFromDb(id, req.body);

    // res.status(200).json({
    //   success: true,
    //   message: "Admin Updated successfully",
    //   data: result,
    // });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins Updated successfully",
      data: result,
    });
  } catch (error) {
    handlePrismaError(error, res);
  }
};
const deleteAdminByid = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await adminService.deleteAdminFromDb(id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin deleted successfully",
    //   data: result,
    // });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    handlePrismaError(error, res);
  }
};
const softDeleteAdminByid = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await adminService.softDeleteAdminFromDb(id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin deleted successfully",
    //   data: result,
    // });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    handlePrismaError(error, res);
  }
};
export const adminController = {
  getAllAdminFromDB,
  getAdminByid,
  updatedAdminByid,
  deleteAdminByid,
  softDeleteAdminByid,
};
