import {
  listarProdutos,
  listarCategorias,
  obterProdutoPorId,
  excluirProduto
} from '../models/Produtos.js';
import { create } from '../config/database.js'
import { lerEstoquePorProdutoFilial } from '../models/Estoque.js';

const listarProdutosPdvController = async (req, res) => {
  try {
    const produtos = await listarProdutos();
    const franquia = req.query.franquia;

    const promises = produtos.map(async (produto) => {
      const dadosEstoque = await lerEstoquePorProdutoFilial(
        produto.id,
        franquia
      );
      const qtd = dadosEstoque ? dadosEstoque.quantidade : 0;

      return {
        id: produto.id,
        nome: produto.nome,
        preco: Number(produto.preco_venda),
        id_categoria: produto.id_categoria,
        imagem: produto.imagem,
        estoque: qtd,
      };
    });

    const produtosComDados = await Promise.all(promises);
    const produtosDisponiveis = produtosComDados.filter((p) => p.estoque > 0);

    res.status(200).json(produtosDisponiveis);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar produtos' });
  }
};

const listarProdutosClienteController = async (req, res) => {
  try {
    const produtos = await listarProdutos();
    const categorias = await listarCategorias();

    const produtosPorCategoria = categorias.map((cat) => {
      return {
        titulo: cat.nome,
        produtos: produtos.filter((prod) => prod.id_categoria === cat.id),
      };
    });

    res.status(200).json(produtosPorCategoria);
  } catch (err) {
    console.error('Erro ao listar produtos: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar produtos' });
  }
};

const produtoPorIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await obterProdutoPorId(id);

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto: ', err);
    res.status(500).json({ mensagem: 'Erro ao buscar produto' });
  }
};

const criarProdutoController = async (req, res) => {
  const { nome, id_categoria, preco_venda, codigo_barras } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ mensagem: 'A imagem do produto é obrigatória!' });
  }

  const imagem = req.file.filename;  

  try {
    if (!nome || !id_categoria || !preco_venda) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
    }

    const novoProduto = {
      nome,
      descricao: codigo_barras || '', 
      id_categoria: Number(id_categoria),
      preco_venda: Number(preco_venda),
      preco_custo: 0,  
      imagem,  
    };

    await create('produtos', novoProduto);

    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!' });

  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ mensagem: 'Erro interno ao cadastrar produto' });
  }
};

const excluirProdutoController = async (req, res) => {
      const { id } = req.params;

  try {
    const resultado = await excluirProduto(id);

    if (resultado > 0) {
      res.status(200).json({ mensagem: 'Produto excluído com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
  } catch (err) {
    console.error('Erro controller ao excluir:', err);

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ 
            mensagem: 'Não é possível excluir este produto pois ele possui histórico de vendas ou estoque vinculado.' 
        });
    }
    
    res.status(500).json({ mensagem: 'Erro interno ao excluir produto.' });
  }
};

export {
  listarProdutosPdvController,
  listarProdutosClienteController,
  produtoPorIdController,
  criarProdutoController,
  excluirProdutoController
};
