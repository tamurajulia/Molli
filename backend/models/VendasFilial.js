import { readAll } from '../config/database.js';

/**
 * Retorna todos os pedidos da filial especificada.
 * @param {number} id_filial 
 * @returns {Promise<Array>} 
 */
const listarPedidosPorFilial = async (id_filial) => {
  try {
    return await readAll('pedidos', `id_filial = ${id_filial}`);
  } catch (err) {
    console.error('Erro model ao listar pedidos por filial:', err);
    throw err;
  }
};

export { listarPedidosPorFilial };