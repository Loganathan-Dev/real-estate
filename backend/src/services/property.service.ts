// backend/src/services/property.service.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import cloudinary from '../config/cloudinary';

export class PropertyService {
  static async createProperty(data: any, userId: string, files: Express.Multer.File[]) {
    const property = await prisma.property.create({
      data: {
        ...data,
        userId,
      },
    });

    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file, index) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'properties',
        });

        return prisma.propertyImage.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: index === 0,
            propertyId: property.id,
          },
        });
      });

      await Promise.all(uploadPromises);
    }

    return this.getPropertyById(property.id);
  }

  static async getPropertyById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
        images: true,
        inquiries: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, profileImage: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { inquiries: true, favorites: true },
        },
      },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    await prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return property;
  }

  static async getAllProperties(filters: any) {
    const {
      page = 1,
      limit = 12,
      search,
      city,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where: Prisma.PropertyWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (city) where.city = { equals: city, mode: 'insensitive' };
    if (propertyType) where.propertyType = propertyType;
    if (listingType) where.listingType = listingType;
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: true,
          user: {
            select: { id: true, name: true, profileImage: true },
          },
          _count: {
            select: { inquiries: true, favorites: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  static async updateProperty(id: string, data: any, userId: string) {
    const property = await this.validateOwnership(id, userId);

    const updated = await prisma.property.update({
      where: { id },
      data,
      include: { images: true },
    });

    return updated;
  }

  static async deleteProperty(id: string, userId: string) {
    const property = await this.validateOwnership(id, userId);

    // Delete images from Cloudinary
    if (property.images) {
      const deletePromises = property.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId)
      );
      await Promise.all(deletePromises);
    }

    await prisma.property.delete({ where: { id } });

    return { message: 'Property deleted successfully' };
  }

  static async getSimilarProperties(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { city: true, propertyType: true, price: true },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const similar = await prisma.property.findMany({
      where: {
        id: { not: propertyId },
        isActive: true,
        OR: [
          { city: property.city },
          { propertyType: property.propertyType },
          {
            price: {
              gte: property.price * 0.8,
              lte: property.price * 1.2,
            },
          },
        ],
      },
      include: {
        images: true,
        user: { select: { id: true, name: true } },
      },
      take: 6,
    });

    return similar;
  }

  private static async validateOwnership(propertyId: string, userId: string) {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, userId },
      include: { images: true },
    });

    if (!property) {
      throw new AppError('Property not found or unauthorized', 404);
    }

    return property;
  }
}