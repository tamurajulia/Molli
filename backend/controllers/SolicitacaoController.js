import {
  listarSolicitacoes,
  criarSolicitacao,
  listarSolicitacoesss,
} from '../models/Solicitacao.js';
import { obterProdutoPorId } from '../models/Produtos.js';
import { read, update } from '../config/database.js';

const listarSolicitacoesController = async (req, res) => {
  // Pega o id_filial do usuário logado (token)
  const { id_filial } = req.func;

  try {
    // Se for Matriz (id 1), pode ver tudo (ou implementar lógica específica, você que sabe Bruno <3).
    // Se for filial, vê só as suas.
    const buscaId = Number(id_filial) === 1 ? null : id_filial;

    const lista = await listarSolicitacoes(buscaId);

    const listaCompleta = await Promise.all(
      lista.map(async (item) => {
        const prod = await obterProdutoPorId(item.id_produto);
        return { ...item, produto_nome: prod ? prod.nome : 'Produto removido' };
      })
    );

    res.json(listaCompleta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao listar solicitações' });
  }
};

const criarSolicitacaoController = async (req, res) => {
  const { id_produto, quantidade, observacao } = req.body;
  const { id_filial } = req.func;

  try {
    if (!id_produto || !quantidade)
      return res.status(400).json({ mensagem: 'Dados incompletos' });

    await criarSolicitacao({
      id_filial,
      id_produto,
      quantidade,
      observacao,
      status: 'Pendente',
    });

    res.status(201).json({ mensagem: 'Solicitação enviada à Matriz!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao criar solicitação' });
  }
};

const listarController = async (req, res) => {
  try {
    const solicitacoes = await listarSolicitacoesss();
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar solicitações de estoque' });
  }
};

const confirmarEnvioController = async (req, res) => {
  const { id } = req.params;

  try {
    const solicitacoes = await listarSolicitacoes(null);
    const solicitacao = solicitacoes.find((s) => s.id === Number(id));

    if (!solicitacao)
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    if (solicitacao.status === 'Enviado')
      return res.status(400).json({ error: 'Solicitação já enviada' });

    const { id_produto, quantidade } = solicitacao;

    const matrizEstoque = await read(
      'estoque',
      `id_produto = ${id_produto} AND id_filial = 1`
    );
    if (!matrizEstoque || matrizEstoque.quantidade < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente na Matriz' });
    }

    await update(
      'estoque',
      { quantidade: matrizEstoque.quantidade - quantidade },
      `id = ${matrizEstoque.id}`
    );

    await update('solicitacoes_estoque', { status: 'Enviado' }, `id = ${id}`);

    res.json({ mensagem: 'Solicitação enviada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao confirmar envio' });
  }
};

export {
  listarSolicitacoesController,
  criarSolicitacaoController,
  listarController,
  confirmarEnvioController,
};
