import { create, readAll, update } from '../config/database.js';

const criarPdv = async (pdvData) => {
  try {
    return await create('pdv', pdvData);
  } catch (err) {
    console.error('Erro model ao criar pdv', err);
    throw err;
  }
};

const buscarPdvAberto = async (idFuncionario) => {
  try {
    return await readAll(
      'pdv',
      `id_funcionario = ${idFuncionario} AND fechado IS NULL`
    );
  } catch (err) {
    console.error('Erro model ao buscar pdv aberto', err);
    throw err;
  }
};

const fecharPdv = async (idPdv, data) => {
  try {
    return await update('pdv', data, `id = ${idPdv}`);
  } catch (err) {
    console.error('Erro model ao fechar pdv', err);
    throw err;
  }
};

export { criarPdv, buscarPdvAberto, fecharPdv };
