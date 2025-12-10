import {
  create,
  deleteRecord,
  read,
  readAll,
  update,
} from '../config/database.js';

const lerEstoquePorProdutoFilial = async (id_produto, id_filial) => {
  try {
    const estoque = await read(
      'estoque',
      `id_produto = ${id_produto} AND id_filial = ${id_filial}`
    );
    return estoque;
  } catch (err) {
    console.error('Erro ao buscar estoque: ', err);
  }
};

const lerEstoquePorFilial = async (id_filial) => {
  try {
    const estoque = await readAll('estoque', `id_filial = ${id_filial}`);
    return estoque;
  } catch (err) {
    console.error('Erro ao buscar estoque por filial: ', err);
  }
};

const lerTodoEstoque = async () => {
  try {
    const estoque = await readAll('estoque');
    return estoque;
  } catch (err) {
    console.error('Erro ao buscar estoque por filial: ', err);
  }
};

const lerTodoEstoqueSemMatriz = async () => {
  try {
    const estoque = await readAll('estoque', `id_filial != 1`);
    return estoque;
  } catch (err) {
    console.error('Erro ao buscar estoque por filial: ', err);
  }
};

const atualizarEstoque = async (id_estoque, novaQtd) => {
  try {
    const atualizacao = await update('estoque', novaQtd, `id = ${id_estoque}`);
    return atualizacao;
  } catch (err) {
    console.error('Erro model ao atualizar estoque: ', err);
  }
};

const excluirEstoque = async (id_estoque) => {
  try {
    const estoque = await deleteRecord('estoque', `id = ${id_estoque}`);
    return estoque;
  } catch (err) {
    console.error('Erro model ao excluir estoque: ', err);
  }
};

const criarEstoque = async (estoqueData) => {
  try {
    const estoque = await create('estoque', estoqueData);
    return estoque;
  } catch (err) {
    console.error('Erro model ao criar estoque: ', err);
  }
};

export {
  lerEstoquePorProdutoFilial,
  lerEstoquePorFilial,
  atualizarEstoque,
  excluirEstoque,
  criarEstoque,
  lerTodoEstoque,
  lerTodoEstoqueSemMatriz,
};
