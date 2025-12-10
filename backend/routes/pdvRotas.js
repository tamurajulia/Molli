import express from 'express';
import {
  abrirCaixaController,
  lerCaixaController,
  fecharPdvController,
} from '../controllers/PdvController.js';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddlewares.js';

router.post('/', authMiddleware, abrirCaixaController);
router.get('/fechamento', authMiddleware, lerCaixaController);
router.put('/', authMiddleware, fecharPdvController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

export default router;
