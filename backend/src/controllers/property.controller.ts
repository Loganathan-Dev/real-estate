// backend/src/controllers/property.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { FavoriteService } from '../services/favorite.service';

export class PropertyController {
  static async createProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const property = await PropertyService.createProperty(
        req.body,
        req.user!.id,
        files
      );
      res.status(201).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await PropertyService.getPropertyById(req.params.id);
      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.getAllProperties(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const property = await PropertyService.updateProperty(
        req.params.id,
        req.body,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await PropertyService.deleteProperty(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSimilarProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await PropertyService.getSimilarProperties(req.params.id);
      res.status(200).json({
        success: true,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await FavoriteService.toggleFavorite(
        req.params.id,
        req.user!.id
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserFavorites(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const favorites = await FavoriteService.getUserFavorites(req.user!.id);
      res.status(200).json({
        success: true,
        data: favorites,
      });
    } catch (error) {
      next(error);
    }
  }
}