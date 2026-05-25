// backend/src/services/inquiry.service.ts
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export class InquiryService {
  static async createInquiry(data: {
    message: string;
    userId: string;
    propertyId: string;
  }) {
    const existingInquiry = await prisma.inquiry.findUnique({
      where: {
        userId_propertyId: {
          userId: data.userId,
          propertyId: data.propertyId,
        },
      },
    });

    if (existingInquiry) {
      throw new AppError('You have already inquired about this property', 400);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        message: data.message,
        userId: data.userId,
        propertyId: data.propertyId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        property: {
          select: { id: true, title: true, user: { select: { email: true } } },
        },
      },
    });

    // Here you would send email notification to property owner
    // await EmailService.sendInquiryNotification(inquiry);

    return inquiry;
  }

  static async getUserInquiries(userId: string) {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId },
      include: {
        property: {
          include: { images: { take: 1 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return inquiries;
  }

  static async getPropertyInquiries(propertyId: string, userId: string) {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, userId },
    });

    if (!property) {
      throw new AppError('Unauthorized', 403);
    }

    const inquiries = await prisma.inquiry.findMany({
      where: { propertyId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return inquiries;
  }

  static async updateInquiryStatus(id: string, status: string, userId: string) {
    const inquiry = await prisma.inquiry.findFirst({
      where: { id },
      include: { property: true },
    });

    if (!inquiry) {
      throw new AppError('Inquiry not found', 404);
    }

    if (inquiry.property.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: status as any },
    });

    return updated;
  }
}