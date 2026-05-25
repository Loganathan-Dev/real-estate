// backend/src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ZodSchema } from 'zod';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  };
};

export const validateZod = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      });
    }
  };
};