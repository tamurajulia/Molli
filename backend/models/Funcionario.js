import { read, readAll, create, update } from '../config/database.js';

const obterFuncionarioPorId = async (id) => {
  try {
    return await read('funcionarios', `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao obter funcionario por id: ', err);
    throw err;
  }
};

const obterFuncaoPorId = async (id) => {
  try {
    return await read('funcoes', `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao obter funcao por id: ', err);
    throw err;
  }
};

const listarFuncionarios = async (filtroCargo, filtroFilial) => {
  try {
    let whereClause = 'true'; 
    
    if (filtroCargo) whereClause += ` AND id_funcao = '${filtroCargo}'`;
    if (filtroFilial) whereClause += ` AND id_filial = '${filtroFilial}'`;

    return await readAll('funcionarios', whereClause);
  } catch (err) {
    console.error('Erro model ao listar funcionários:', err);
    throw err;
  }
};

const criarFuncionario = async (dados) => {
  try {
    return await create('funcionarios', dados);
  } catch (err) {
    console.error('Erro model ao criar funcionário:', err);
    throw err;
  }
};

const atualizarFuncionario = async (id, dados) => {
  try {
    return await update('funcionarios', dados, `id = ${id}`);
  } catch (err) {
    console.error('Erro model ao atualizar funcionário:', err);
    throw err;
  }
};

const buscarPorCpf = async (cpf) => {
    try {
        return await read('funcionarios', `cpf = '${cpf}'`);
    } catch (err) {
        throw err;
    }
}

const listarFuncionariosPorFilial = async (id_filial) => {
    try {
        let where = '1=1'; 
        if (id_filial) {
            where += ` AND id_filial = ${id_filial}`;
        }
        return await readAll('funcionarios', where);
    } catch (err) {
        console.error('Erro model ao listar funcionários por filial:', err);
        throw err;
    }
};

export { 
    obterFuncionarioPorId, 
    obterFuncaoPorId, 
    listarFuncionarios, 
    criarFuncionario, 
    atualizarFuncionario,
    buscarPorCpf,
    listarFuncionariosPorFilial
};