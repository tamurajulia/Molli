import { read, readAll, deleteRecord } from '../config/database.js';

const listarProdutos = async () => {
  try {
    const produtos = await readAll('produtos');
    return produtos;
  } catch (err) {
    console.error('Erro ao buscar produtos: ', err);
  }
};

const listarCategorias = async () => {
  try {
    const cat = await readAll('categorias');
    return cat;
  } catch (err) {
    console.error('Erro ao buscar categorias: ', err);
  }
};

const obterProdutoPorId = async (id_produto) => {
  try {
    const produtos = await read('produtos', `id = ${id_produto}`);
    return produtos;
  } catch (err) {
    console.error('Erro ao buscar produtos: ', err);
  }
};

const excluirProduto = async (id_produto) => {
    try {
    return await deleteRecord('produtos', `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao excluir produto:', err);
    throw err;
  }
};

export { listarProdutos, obterProdutoPorId, listarCategorias, excluirProduto };
