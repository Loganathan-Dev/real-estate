// backend/src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user.id, user.email, user.role);

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    return { user: userWithoutPassword, token };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            favorites: true,
            inquiries: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  private static generateToken(id: string, email: string, role: string) {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }
}