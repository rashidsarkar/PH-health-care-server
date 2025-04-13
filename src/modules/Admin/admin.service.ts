import { Admin, Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.const";
import { paginationHelper } from "../../helpers/paginationHealper";
import prisma from "../../shared/prisma";

const getAllAdmin = async (params: any, option: any) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(option);

  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.AdminWhereInput[] = [];

  // console.log(filterData);
  if (params?.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => {
        return {
          [field]: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }
  // console.dir(andCondition, { depth: "infinity" });

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: filterData[key],
          },
        };
      }),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      option.sortBy && option.sortOrder
        ? {
            [option.sortBy]: option.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminByIdFromDb = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};
const updatedAdminByIdFromDb = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUnique({
    where: {
      id: id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });
  return result;
};
const deleteAdminFromDb = async (id: string) => {
  const res = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.delete({ where: { id: id } });
    const userDelete = await tx.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return { adminDeletedData, userDelete };
  });
  return res;
};
export const adminService = {
  getAllAdmin,
  getAdminByIdFromDb,
  updatedAdminByIdFromDb,
  deleteAdminFromDb,
};
