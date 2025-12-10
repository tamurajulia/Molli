import { read, readAll, create, update, deleteRecord } from "../config/database.js";

const listarProdutos = async () => {
  try {
    return await readAll("produtos");
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    throw err;
  }
};

const obterProdutoPorId = async (id) => {
  try {
    const resultado = await read("produtos", `id = ${id}`);
    return resultado[0] || null;
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    throw err;
  }
};


const criarProduto = async (dados) => {
  try {
    return await create("produtos", dados);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    throw err;
  }
};

const atualizarProduto = async (id, dados) => {
  try {
    return await update("produtos", dados, `id = ${id}`);
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    throw err;
  }
};

const excluirProduto = async (id) => {
  try {
    return await deleteRecord("produtos", `id = ${id}`);
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    throw err;
  }
};

export {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto
};
