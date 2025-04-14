import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../shared/pick";
import { adminFilterableFields } from "./admin.const";
import { handlePrismaError } from "../../utils/handlePrismaError";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getAllAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = pick(req.query, adminFilterableFields);
    const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(option);
    console.log(filter);
    const result = await adminService.getAllAdmin(filter, option);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admins retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    // handlePrismaError(error, res);
    next(error);
  }
};
const getAdminByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await adminService.getAdminByIdFromDb(id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin retrieved successfully",
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admins retrieved successfully",
      data: result,
    });
  } catch (error) {
    // handlePrismaError(error, res);
    next(error);
  }
};
const updatedAdminByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const result = await adminService.updatedAdminByIdFromDb(id, req.body);

    // res.status(200).json({
    //   success: true,
    //   message: "Admin Updated successfully",
    //   data: result,
    // });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admins Updated successfully",
      data: result,
    });
  } catch (error) {
    // handlePrismaError(error, res);
    next(error);
  }
};
const deleteAdminByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await adminService.deleteAdminFromDb(id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin deleted successfully",
    //   data: result,
    // });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    // handlePrismaError(error, res);
    next(error);
  }
};
const softDeleteAdminByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await adminService.softDeleteAdminFromDb(id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin deleted successfully",
    //   data: result,
    // });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    // handlePrismaError(error, res);
    next(error);
  }
};
export const adminController = {
  getAllAdminFromDB,
  getAdminByid,
  updatedAdminByid,
  deleteAdminByid,
  softDeleteAdminByid,
};
