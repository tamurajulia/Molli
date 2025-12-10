import express from 'express';
import {
  listarSolicitacoesController,
  criarSolicitacaoController,
  listarController,
  confirmarEnvioController,
} from '../controllers/SolicitacaoController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();
router.get('/', authMiddleware, listarSolicitacoesController);
router.get('/matriz', listarController);
router.post('/', authMiddleware, criarSolicitacaoController);
router.put('/:id', confirmarEnvioController);

export default router;
