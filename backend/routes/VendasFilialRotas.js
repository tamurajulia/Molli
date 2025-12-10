import express from 'express';
import { obterQuantidadesPedidos } from '../controllers/PedidosFilialController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/quantidades', authMiddleware, obterQuantidadesPedidos);

router.options('/quantidades', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

export default router;