import express from 'express';
import { 
    obterFuncionarioPorIdController, 
    obterFuncionarioParaEditarController,
    listarTodosController,
    criarFuncionarioController,
    atualizarFuncionarioController
} from '../controllers/FuncionarioController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/id', authMiddleware, obterFuncionarioPorIdController); 

router.get('/', authMiddleware, listarTodosController); 
router.post('/', authMiddleware, criarFuncionarioController); 
router.put('/:id', authMiddleware, atualizarFuncionarioController); 

router.get('/:id', authMiddleware, obterFuncionarioParaEditarController); 

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, OPTIONS');
  res.status(204).send();
});

export default router;