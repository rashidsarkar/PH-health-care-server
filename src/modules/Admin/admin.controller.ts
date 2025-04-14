import { RequestHandler } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../shared/pick";
import { adminFilterableFields } from "./admin.const";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchasync";


const getAllAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
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
});
const getAdminByid = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminService.getAdminByIdFromDb(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admins retrieved successfully",
    data: result,
  });
});
const updatedAdminByid = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminService.updatedAdminByIdFromDb(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admins Updated successfully",
    data: result,
  });
});
const deleteAdminByid = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminService.deleteAdminFromDb(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});
const softDeleteAdminByid = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminService.softDeleteAdminFromDb(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});
export const adminController = {
  getAllAdminFromDB,
  getAdminByid,
  updatedAdminByid,
  deleteAdminByid,
  softDeleteAdminByid,
};
