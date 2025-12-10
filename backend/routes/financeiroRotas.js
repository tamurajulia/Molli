import express from 'express';
import { listarSalariosController, listarEntradasController, obterFluxoCaixaController } from '../controllers/FinanceiroController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/salarios', authMiddleware, listarSalariosController);
router.get('/entradas', authMiddleware, listarEntradasController);
router.get('/fluxo', authMiddleware, obterFluxoCaixaController);

router.options('/salarios', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

router.options('/entradas', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

export default router;