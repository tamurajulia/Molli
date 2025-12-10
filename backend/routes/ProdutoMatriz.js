import express from "express";
import {
  listarProdutosController,
  obterProdutoController,
  criarProdutoController,
  atualizarProdutoController,
  excluirProdutoController
} from "../controllers/ProdutoMatrizController.js";

const router = express.Router();

router.get("/", listarProdutosController);
router.get("/:id", obterProdutoController);
router.post("/", criarProdutoController);
router.put("/:id", atualizarProdutoController);
router.delete("/:id", excluirProdutoController);

router.options("/", (req, res) => {
  res.setHeader("Allow", "GET, POST, OPTIONS");
  res.status(204).send();
});

router.options("/:id", (req, res) => {
  res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
  res.status(204).send();
});

export default router;
