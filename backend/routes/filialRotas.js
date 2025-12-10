import express from 'express';
import { 
    listarFilialController, 
    obterFilialController,
    criarFilialController,
    atualizarFilialController,
    excluirFilialController
} from '../controllers/FilialController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';
import upload from '../config/upload.js'; 

const router = express.Router();

router.get('/', listarFilialController);
router.get('/:id', obterFilialController);
router.post('/', authMiddleware, upload.single('foto_filial'), criarFilialController);
router.put('/:id', authMiddleware, upload.single('foto_filial'), atualizarFilialController);
router.delete('/:id', authMiddleware, excluirFilialController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
  res.status(204).send();
});

export default router;