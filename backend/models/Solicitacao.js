import { create, readAll } from '../config/database.js';

const listarSolicitacoes = async (id_filial) => {
  try {
    const where = id_filial ? `id_filial = ${id_filial}` : null;
    const solicitacoes = await readAll('solicitacoes_estoque', where);
    return solicitacoes;
  } catch (err) {
    throw err;
  }
};

const listarSolicitacoesss = async (id_filial) => {
  try {
    const solicitacoes = await readAll('solicitacoes_estoque');
    return solicitacoes;
  } catch (err) {
    console.error('Erro model ao listar solicitações de estoque: ', err);
    throw err;
  }
};

const criarSolicitacao = async (dados) => {
  try {
    return await create('solicitacoes_estoque', dados);
  } catch (err) {
    throw err;
  }
};

export { listarSolicitacoes, criarSolicitacao, listarSolicitacoesss };
