import express from 'express';
import { obterResumoDashboard } from '../controllers/DashAdminController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/resumo', authMiddleware, obterResumoDashboard);

router.options('/resumo', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

export default router;
