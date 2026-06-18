import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { ApplicationInput, ApplicationUpdate, ApplicationQuery } from "./schema.js";

export async function listApplications(query: ApplicationQuery) {
  const where: Record<string, unknown> = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { companyName: { contains: query.search } },
      { jobTitle: { contains: query.search } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getApplication(id: number) {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
    throw new AppError("Application not found", 404);
  }
  return application;
}

export async function createApplication(data: ApplicationInput) {
  return prisma.application.create({
    data: {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      status: data.status,
      appliedDate: new Date(data.appliedDate),
      notes: data.notes ?? null,
    },
  });
}

export async function updateApplication(id: number, data: ApplicationUpdate) {
  await getApplication(id);

  const updateData: Record<string, unknown> = {};
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
  if (data.jobType !== undefined) updateData.jobType = data.jobType;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.appliedDate !== undefined) updateData.appliedDate = new Date(data.appliedDate);
  if (data.notes !== undefined) updateData.notes = data.notes;

  return prisma.application.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteApplication(id: number) {
  await getApplication(id);
  await prisma.application.delete({ where: { id } });
}
