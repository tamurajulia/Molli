import {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto
} from "../models/ProdutosMatriz.js";

const listarProdutosController = async (req, res) => {
  try {
    const dados = await listarProdutos();
    res.status(200).json(dados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar produtos" });
  }
};

const obterProdutoController = async (req, res) => {
  try {
    const id = req.params.id;
    const produto = await obterProdutoPorId(id);

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.status(200).json(produto);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar produto" });
  }
};

const criarProdutoController = async (req, res) => {
  try {
    const dados = req.body;

    const novoId = await criarProduto(dados);

    res.status(201).json({
      mensagem: "Produto criado com sucesso",
      id: novoId
    });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar produto" });
  }
};

const atualizarProdutoController = async (req, res) => {
  try {
    const id = req.params.id;
    const dados = req.body;

    const linhasAfetadas = await atualizarProduto(id, dados);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.status(200).json({ mensagem: "Produto atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar produto" });
  }
};

const excluirProdutoController = async (req, res) => {
  try {
    const id = req.params.id;

    const linhasAfetadas = await excluirProduto(id);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.status(200).json({ mensagem: "Produto excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao excluir produto" });
  }
};

export {
  listarProdutosController,
  obterProdutoController,
  criarProdutoController,
  atualizarProdutoController,
  excluirProdutoController
};
