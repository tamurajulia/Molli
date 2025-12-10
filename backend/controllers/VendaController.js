import { buscarPdvAberto } from '../models/Pdv.js';
import {
  criarPedido,
  criarItemPedido,
  atualizarLucroPedido,
  listarVendasFilial,
  listarVendasProdutos,
  listarVendas,
} from '../models/Vendas.js';
import { obterProdutoPorId } from '../models/Produtos.js';
import {
  lerEstoquePorProdutoFilial,
  atualizarEstoque,
} from '../models/Estoque.js';

const criarPedidoController = async (req, res) => {
  try {
    const id_funcionario = req.func.id;
    const id_filial = req.func.id_filial;
    const { valor_total, metodo_pagamento, parcelas, produtos } = req.body;

    const pdvAberto = await buscarPdvAberto(id_funcionario);
    if (!pdvAberto || pdvAberto.length === 0) {
      return res
        .status(400)
        .json({ mensagem: 'Não há caixa aberto para este funcionário.' });
    }
    const id_pdv = pdvAberto[0].id;

    const novoPedido = await criarPedido({
      id_funcionario,
      id_filial,
      id_pdv,
      valor_total,
      metodo_pagamento,
      parcelas,
      lucro: 0,
    });

    const idPedidoGerado = novoPedido;

    let lucro = 0;

    const arrayDePromessas = produtos.map(async (item) => {
      await criarItemPedido({
        id_pedido: idPedidoGerado,
        id_produto: item.id,
        quantidade: item.qtd,
        preco_unitario: item.preco,
        total: item.preco * item.qtd,
      });

      const produtoDb = await obterProdutoPorId(item.id);
      lucro += item.preco * item.qtd - produtoDb.preco_custo * item.qtd;

      const estoqueRegistro = await lerEstoquePorProdutoFilial(
        item.id,
        id_filial
      );

      let estoqueAtual = null;

      if (Array.isArray(estoqueRegistro) && estoqueRegistro.length > 0) {
        estoqueAtual = estoqueRegistro[0];
      } else if (estoqueRegistro && estoqueRegistro.id) {
        estoqueAtual = estoqueRegistro;
      }
      if (estoqueAtual) {
        const qtdAtual = Number(estoqueAtual.quantidade);
        const qtdVenda = Number(item.qtd);

        const novaQuantidade = qtdAtual - qtdVenda;

        await atualizarEstoque(estoqueAtual.id, { quantidade: novaQuantidade });
      } else {
        console.warn(
          `Estoque não encontrado (ou formato inválido) para produto ID ${item.id} na filial ${id_filial}`
        );
      }
    });

    await Promise.all(arrayDePromessas);
    await atualizarLucroPedido(idPedidoGerado, Number(lucro));

    res.status(201).send({
      mensagem: 'Pedido criado com sucesso',
      id_pedido: idPedidoGerado,
    });
  } catch (err) {
    console.error('Erro ao criar Pedido: ', err);
    res.status(500).json({ mensagem: 'Erro ao criar Pedido' });
  }
};

const listarVendasFilialController = async (req, res) => {
  try {
    const id_filial = req.func.id_filial;

    if (!id_filial) {
      return res
        .status(400)
        .json({ mensagem: 'Filial do usuário não identificada.' });
    }

    const vendas = await listarVendasFilial(id_filial);

    res.status(200).json(vendas);
  } catch (err) {
    console.error('Erro ao listar vendas da filial: ', err);
    res.status(500).json({ mensagem: 'Erro interno ao buscar vendas.' });
  }
};

const listarVendasController = async (req, res) => {
  try {
    const vendas = await listarVendas();
    res.status(200).json(vendas);
  } catch (err) {
    console.error('Erro ao listar vendas da filial: ', err);
    res.status(500).json({ mensagem: 'Erro interno ao buscar vendas.' });
  }
};

const listarItensPedidoController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ mensagem: 'ID do pedido não fornecido.' });
    }

    const itensBrutos = await listarVendasProdutos(id);

    const itensComNomes = await Promise.all(
      itensBrutos.map(async (item) => {
        const infoProduto = await obterProdutoPorId(item.id_produto);
        return {
          ...item,
          nome_produto: infoProduto
            ? infoProduto.nome
            : 'Produto não encontrado',
          imagem: infoProduto ? infoProduto.imagem : null,
        };
      })
    );

    res.status(200).json(itensComNomes);
  } catch (err) {
    console.error('Erro ao listar itens do pedido: ', err);
    res.status(500).json({ mensagem: 'Erro interno ao buscar itens.' });
  }
};

export {
  criarPedidoController,
  listarVendasFilialController,
  listarItensPedidoController,
  listarVendasController,
};
