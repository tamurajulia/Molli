import { read } from '../config/database.js';

const obterCategoriaPorId = async (id) => {
  try {
    const categoria = read('categorias', `id = ${id}`);
    return categoria;
  } catch (err) {
    console.error('Erro ao buscar categoria por id: ', err);
  }
};

export { obterCategoriaPorId };
