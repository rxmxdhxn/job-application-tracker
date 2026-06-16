import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req: Request, res: Response) => {
  const { email, password, name: userName } = req.body;

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name: userName },
  });

  res
    .status(201)
    .json({ message: "User registered successfully", userId: user.id });
};

export const login = async (req: Request, res: Response) => {
  const { email, password: inputPassword } = req.body;

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  // Check the password
  const valid = await bcrypt.compare(inputPassword, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // set the token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour
  });
  res.json({ message: "Login successful", userId: user.id, token });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      cv: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
};

// updateprofile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const UserId = req.user!.id;
  const { name } = req.body;

  const user = await prisma.user.update({
    where: { id: UserId },
    data: { name },
    select: { id: true, email: true, name: true, avatar: true, cv: true },
  });

  res.json(user);
};

// Change Password
export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    res.status(400).json({ error: "Wrond password" });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  res.json({ message: "Password update successful" });
};

// upload avatar
export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const file = (req as any).file;

  if (!file) {
    res.status(400).json({ error: "File not found" });
    return;
  }

  const avatarPath = "/uploads/avatars/${file.filename}";

  await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarPath },
  });
};

// PUT /api/auth/cv
export const uploadCv = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const file = (req as any).file;

  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const cvPath = `uploads/cv/${file.filename}`;

  await prisma.user.update({
    where: { id: userId },
    data: { cv: cvPath },
  });

  res.json({ cv: cvPath });
};

//deleteCV
export const deleteCv = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const fs = await import("fs");
  const path = await import("path");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.cv) {
    res.status(404).json({ error: "CV tidak ditemukan" });
    return;
  }

  const filePath = path.join(process.cwd(), user.cv);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { cv: null },
  });

  res.json({ message: "CV berhasil dihapus" });
};

