import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

   if (!username) {
  return res.status(400).json({
    message: "Username is required",
  });
}

if (!email) {
  return res.status(400).json({
    message: "Email is required",
  });
}

if (!password) {
  return res.status(400).json({
    message: "Password is required",
  });
}

    if (typeof password !== "string" || password.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters long",
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Please provide a valid email address",
  });
}

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "READER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong during registration",
    });
  }
};