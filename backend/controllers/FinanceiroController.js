import {
  listarSalariosProjecao,
  listarEntradasFinanceiro,
  obterDadosFluxoCaixa,
} from "../models/Financeiro.js";

const listarSalariosController = async (req, res) => {
  try {
    const todos = await listarSalariosProjecao();

    const { id_filial, id_funcao } = req.func;
    let resultado = todos;

    if (Number(id_filial) !== 1 && Number(id_funcao) !== 1) {
      resultado = todos.filter((item) => item.id_filial === id_filial);
    }

    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar salários" });
  }
};

const listarEntradasController = async (req, res) => {
  try {
    const todas = await listarEntradasFinanceiro();

    const { id_filial, id_funcao } = req.func;
    let resultado = todas;

    if (Number(id_filial) !== 1 && Number(id_funcao) !== 1) {
      resultado = todas.filter((item) => item.id_filial === id_filial);
    }

    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar entradas" });
  }
};

const obterFluxoCaixaController = async (req, res) => {
  try {
    const dados = await obterDadosFluxoCaixa();
    res.status(200).json(dados);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao obter fluxo de caixa" });
  }
};

export {
  listarSalariosController,
  listarEntradasController,
  obterFluxoCaixaController,
};
