import express from 'express';
import { 
    listarContasController, 
    buscarContaController, 
    criarContaController, 
    atualizarContaController, 
    excluirContaController 
} from '../controllers/ContasController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', authMiddleware, listarContasController); 
router.get('/:id', authMiddleware, buscarContaController); 
router.post('/', authMiddleware, criarContaController);
router.put('/:id', authMiddleware, atualizarContaController);
router.delete('/:id', authMiddleware, excluirContaController); 

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
  res.status(204).send();
});

export default router;