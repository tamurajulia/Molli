import { read, readAll, create, update, deleteRecord } from "../config/database.js";

const listarFornecedor = async () => {
  try {
    return await readAll("fornecedores");
  } catch (err) {
    console.error("Erro ao listar fornecedores:", err);
    throw err;
  }
};

const obterFornecedorPorId = async (id) => {
  try {
    return await read("fornecedores", `id = ${id}`);
  } catch (err) {
    console.error("Erro ao buscar fornecedor:", err);
    throw err;
  }
};

const criarFornecedor = async (dados) => {
  try {
    return await create("fornecedores", dados);
  } catch (err) {
    console.error("Erro ao criar fornecedor:", err);
    throw err;
  }
};

const atualizarFornecedor = async (id, dados) => {
  try {
    return await update("fornecedores", dados, `id = ${id}`);
  } catch (err) {
    console.error("Erro ao atualizar fornecedor:", err);
    throw err;
  }
};

const excluirFornecedor = async (id) => {
  try {
    return await deleteRecord("fornecedores", `id = ${id}`);
  } catch (err) {
    console.error("Erro ao excluir fornecedor:", err);
    throw err;
  }
};

export {
  listarFornecedor,
  obterFornecedorPorId,
  criarFornecedor,
  atualizarFornecedor,
  excluirFornecedor
};
