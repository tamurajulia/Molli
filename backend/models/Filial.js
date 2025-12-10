import { readAll, read, create, update, deleteRecord } from '../config/database.js';

const listarFilial = async () => {
  try {
    const filiais = await readAll('filiais');
    return filiais;
  } catch (err) {
    console.error('Erro model ao listar filiais: ', err);
    throw err;
  }
};
const obterFilialPorId = async (id) => {
  try {
    const filial = await read('filiais', `id = ${id}`);
    return filial;
  } catch (err) {
    console.error('Erro model ao obter filial por id: ', err);
    throw err;
  }
};
const criarFilial = async (dadosFilial) => {
  try {
    return await create('filiais', dadosFilial);
  } catch (err) {
    console.error('Erro model ao criar filial: ', err);
    throw err;
  }
};

const atualizarFilial = async (id, dadosFilial) => {
  try {
    return await update('filiais', dadosFilial, `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao atualizar filial: ', err);
    throw err;
  }
};

const excluirFilial = async (id) => {
  try {
    return await deleteRecord('filiais', `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao excluir filial: ', err);
    throw err;
  }
};

export { listarFilial, obterFilialPorId, criarFilial, atualizarFilial, excluirFilial };