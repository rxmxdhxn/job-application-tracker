import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../db.js";

// Add new application
export const createApplication = async (req: AuthRequest, res: Response) => {
  const {
    company,
    location,
    position,
    requirements,
    status,
    appliedAt,
    limitDate,
    url,
    notes,
  } = req.body;
  const userId = req.user!.id;

  const application = await prisma.application.create({
    data: {
      company,
      location,
      position,
      requirements,
      appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
      limitDate: limitDate ? new Date(limitDate) : null,
      url,
      notes,
      userId,
      timelines: {
        create: { status: "applied", note: "Lamaran dikirim" },
      },
    },
  });

  res.status(201).json(application);
};

// Get all applications for the authenticated user
export const getApplications = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const applications = await prisma.application.findMany({
    where: { userId },
    include: { timelines: true },
    orderBy: { appliedAt: "desc" },
  });
  res.json(applications);
};

// Get a single application by ID
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id as string);
  const userId = req.user!.id;

  const application = await prisma.application.findFirst({
    where: { id, userId },
    include: { timelines: { orderBy: { createdAt: "asc" } }, documents: true },
  });

  if (!application) {
    res.status(404).json({ message: "Application not found" });
    return;
  }
  res.json(application);
};

// Update an application
export const updateApplication = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id as string);
  const userId = req.user!.id;
  const {
    company,
    location,
    position,
    requirements,
    status,
    appliedAt,
    limitDate,
    url,
    notes,
  } = req.body;

  const existingApplication = await prisma.application.findFirst({
    where: { id, userId },
  });

  if (!existingApplication) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      company,
      location,
      position,
      requirements,
      status,
      appliedAt: appliedAt
        ? new Date(appliedAt)
        : existingApplication.appliedAt,
      limitDate: limitDate
        ? new Date(limitDate)
        : existingApplication.limitDate,
      url,
      notes,
    },
  });

  res.json(updatedApplication);
};

//update status application with timeline
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  const id = parseInt(req.params.id as string);
  const userId = req.user!.id;
  const { status, note } = req.body;

  const existingApplication = await prisma.application.findFirst({
    where: { id, userId },
  });
  if (!existingApplication) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      status,
      timelines: {
        create: { status, note },
      },
    },
  });
  res.json(updatedApplication);
};

// Delete an application
export const deleteApplication = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id as string);
  const userId = req.user!.id;

  const existingApplication = await prisma.application.findFirst({
    where: { id, userId },
  });
  if (!existingApplication) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  await prisma.timeline.deleteMany({ where: { applicationId: id } });
  await prisma.document.deleteMany({ where: { applicationId: id } });
  await prisma.application.delete({ where: { id } });
  res.json({ message: "Application deleted successfully" });
};
