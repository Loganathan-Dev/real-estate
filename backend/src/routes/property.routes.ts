// backend/src/routes/property.routes.ts
import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getProperty);
router.get('/:id/similar', PropertyController.getSimilarProperties);

router.use(authenticate);
router.post('/', upload.array('images', 10), PropertyController.createProperty);
router.put('/:id', PropertyController.updateProperty);
router.delete('/:id', PropertyController.deleteProperty);
router.post('/:id/favorite', PropertyController.toggleFavorite);
router.get('/user/favorites', PropertyController.getUserFavorites);

export default router;