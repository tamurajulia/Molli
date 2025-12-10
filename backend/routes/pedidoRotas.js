import express from 'express';
import {
  criarPedidoController,
  listarVendasFilialController,
  listarItensPedidoController,
  listarVendasController,
} from '../controllers/VendaController.js';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddlewares.js';

router.get('/', listarVendasController);
router.post('/', authMiddleware, criarPedidoController);
router.get('/filial', authMiddleware, listarVendasFilialController);
router.get('/itens/:id', authMiddleware, listarItensPedidoController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

export default router;
