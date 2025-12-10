import { readAll, create, update, deleteRecord, read } from '../config/database.js';

const listarContas = async (id_filial, status) => {
  try {
    let conditions = [];
    
    if (id_filial) {
      conditions.push(`id_filial = ${id_filial}`);
    }

    if (status && status !== 'Todos') {
      conditions.push(`status = '${status}'`);
    }

    const where = conditions.length > 0 ? conditions.join(' AND ') : null;
    return await readAll('contas_pagar', where);
  } catch (err) {
    console.error('Erro model ao listar contas:', err);
    throw err;
  }
};

const buscarContaPorId = async (id) => {
  try {
    return await read('contas_pagar', `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao buscar conta:', err);
    throw err;
  }
};

const criarConta = async (dados) => {
  try {
    return await create('contas_pagar', dados);
  } catch (err) {
    console.error('Erro model ao criar conta:', err);
    throw err;
  }
};

const atualizarConta = async (id, dados) => {
  try {
    return await update('contas_pagar', dados, `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao atualizar conta:', err);
    throw err;
  }
};

const excluirConta = async (id) => {
  try {
    return await deleteRecord('contas_pagar', `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao excluir conta:', err);
    throw err;
  }
};

export { listarContas, buscarContaPorId, criarConta, atualizarConta, excluirConta };