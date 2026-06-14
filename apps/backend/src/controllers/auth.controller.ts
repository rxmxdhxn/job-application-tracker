import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

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
