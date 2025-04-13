import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: any, res: Response) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Duplicate field value error",
          errorCode: error.code,
          meta: error.meta,
          stack: error.stack,
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Resource not found",
          errorCode: error.code,
          meta: error.meta,
          stack: error.stack,
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Prisma error: ${error.code}`,
          errorCode: error.code,
          meta: error.meta,
          stack: error.stack,
        });
    }
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error?.message || error,
    stack: error?.stack,
  });
};
