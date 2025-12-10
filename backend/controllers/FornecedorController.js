import {
  listarFornecedor,
  obterFornecedorPorId,
  criarFornecedor,
  atualizarFornecedor,
  excluirFornecedor
} from "../models/Fornecedor.js";

const listarFornecedorController = async (req, res) => {
  try {
    const dados = await listarFornecedor();
    res.status(200).json(dados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar fornecedores" });
  }
};

const obterFornecedorController = async (req, res) => {
  try {
    const id = req.params.id;
    const fornecedor = await obterFornecedorPorId(id);

    if (!fornecedor) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    res.status(200).json(fornecedor);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar fornecedor" });
  }
};

const criarFornecedorController = async (req, res) => {
  try {
    const dados = req.body;

    const novoId = await criarFornecedor(dados);

    res.status(201).json({
      mensagem: "Fornecedor criado com sucesso",
      id: novoId
    });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar fornecedor" });
  }
};

const atualizarFornecedorController = async (req, res) => {
  try {
    const id = req.params.id;
    const dados = req.body;

    const linhasAfetadas = await atualizarFornecedor(id, dados);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    res.status(200).json({ mensagem: "Fornecedor atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar fornecedor" });
  }
};

const excluirFornecedorController = async (req, res) => {
  try {
    const id = req.params.id;

    const linhasAfetadas = await excluirFornecedor(id);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }

    res.status(200).json({ mensagem: "Fornecedor excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao excluir fornecedor" });
  }
};

export {
  listarFornecedorController,
  obterFornecedorController,
  criarFornecedorController,
  atualizarFornecedorController,
  excluirFornecedorController
};
