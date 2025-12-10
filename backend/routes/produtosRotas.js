import express from 'express';
import {
  listarProdutosPdvController,
  listarProdutosClienteController,
  produtoPorIdController,
  criarProdutoController,
  excluirProdutoController
} from '../controllers/ProdutosController.js';
import authMiddleware from '../middlewares/authMiddlewares.js';
import uploadProdutos from '../config/uploadProdutos.js';  

const router = express.Router();

router.get('/', listarProdutosPdvController);
router.get('/cliente', listarProdutosClienteController);
router.get('/:id', produtoPorIdController);

router.post('/', uploadProdutos.single('imagem'), authMiddleware, criarProdutoController);

router.delete('/:id', authMiddleware, excluirProdutoController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(204).send();
});

export default router;
