import { Admin, Prisma, PrismaClient, User, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.const";
import { paginationHelper } from "../../helpers/paginationHealper";
import prisma from "../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllAdmin = async (
  params: IAdminFilterRequest,
  option: IPaginationOptions
) => {
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
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andCondition.push({
    isDeleted: false,
  });
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

const getAdminByIdFromDb = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  return result;
};
const updatedAdminByIdFromDb = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUnique({
    where: {
      id: id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id: id,
      isDeleted: false,
    },
    data: {
      ...data,
    },
  });
  return result;
};
const deleteAdminFromDb = async (
  id: string
): Promise<{ adminDeletedData: Admin; userDelete: User } | null> => {
  await prisma.admin.findUniqueOrThrow({ where: { id: id } });
  const res = await prisma.$transaction(async (tx) => {
    const adminDeletedData: Admin = await tx.admin.delete({
      where: { id: id },
    });
    const userDelete: User = await tx.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return { adminDeletedData, userDelete };
  });
  return res;
};
const softDeleteAdminFromDb = async (
  id: string
): Promise<{ adminDeletedData: Admin; userDelete: User } | null> => {
  await prisma.admin.findUniqueOrThrow({ where: { id: id, isDeleted: false } });
  const res = await prisma.$transaction(async (tx) => {
    const adminDeletedData: Admin = await tx.admin.update({
      where: { id: id },
      data: { isDeleted: true },
    });
    const userDelete: User = await tx.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
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
  softDeleteAdminFromDb,
};
