import { create, readAll, update } from '../config/database.js';

const criarPedido = async (pedidoData) => {
  try {
    const venda = create('pedidos', pedidoData);
    return venda;
  } catch (err) {
    console.error('Erro model ao criar pedido', err);
  }
};

const criarItemPedido = async (pedidoData) => {
  try {
    const venda = create('pedido_itens', pedidoData);
    return venda;
  } catch (err) {
    console.error('Erro model ao criar item pedido', err);
  }
};

const lerVendasPdv = async (idPdv) => {
  try {
    const vendas = await readAll('pedidos', `id_pdv = ${idPdv}`);
    return vendas || [];
  } catch (err) {
    console.error('Erro model ao ler pedidos por pdv', err);
    return [];
  }
};

const atualizarLucroPedido = async (idPedido, lucroTotal) => {
  try {
    return await update('pedidos', { lucro: lucroTotal }, `id = ${idPedido}`);
  } catch (err) {
    console.error('Erro ao atualizar lucro do pedido', err);
    throw err;
  }
};

const listarVendasFilial = async (id_filial) => {
  try {
    const vendas = await readAll('pedidos', `id_filial = ${id_filial}`);
    return vendas || [];
  } catch (err) {
    console.error('Erro model ao ler pedidos por filial', err);
    return [];
  }
};

const listarVendas = async () => {
  try {
    const vendas = await readAll('pedidos');
    return vendas || [];
  } catch (err) {
    console.error('Erro model ao ler pedidos', err);
    return [];
  }
};

const listarVendasProdutos = async (id_pedido) => {
  try {
    const vendas = await readAll('pedido_itens', `id_pedido = ${id_pedido}`);
    return vendas || [];
  } catch (err) {
    console.error('Erro model ao ler itens pedidos', err);
    return [];
  }
};

export {
  criarPedido,
  criarItemPedido,
  lerVendasPdv,
  atualizarLucroPedido,
  listarVendasFilial,
  listarVendasProdutos,
  listarVendas,
};
