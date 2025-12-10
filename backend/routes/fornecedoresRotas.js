import express from "express";
import {
  listarFornecedorController,
  obterFornecedorController,
  criarFornecedorController,
  atualizarFornecedorController,
  excluirFornecedorController
} from "../controllers/FornecedorController.js";

const router = express.Router();

router.get("/", listarFornecedorController);
router.get("/:id", obterFornecedorController);
router.post("/", criarFornecedorController);
router.put("/:id", atualizarFornecedorController);
router.delete("/:id", excluirFornecedorController);

router.options("/", (req, res) => {
  res.setHeader("Allow", "GET, POST, OPTIONS");
  res.status(204).send();
});

router.options("/:id", (req, res) => {
  res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
  res.status(204).send();
});

export default router;
