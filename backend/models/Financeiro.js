import { readAll } from '../config/database.js';

const listarSalariosProjecao = async () => {
  try {
    const sql = `
      SELECT 
        f.id, 
        f.nome as funcionario, 
        f.salario, 
        f.ativo,
        c.funcao as cargo,
        fi.endereco as filial_endereco,
        fi.id as id_filial
      FROM funcionarios f
      JOIN funcoes c ON f.id_funcao = c.id
      JOIN filiais fi ON f.id_filial = fi.id
      WHERE f.ativo = 1
    `;
    const funcionarios = await readAll('funcionarios', 'ativo = 1');
    const funcoes = await readAll('funcoes');
    const filiais = await readAll('filiais');

    return funcionarios.map(func => {
        const cargo = funcoes.find(c => c.id === func.id_funcao)?.funcao || 'N/A';
        const filial = filiais.find(fi => fi.id === func.id_filial);
        
        return {
            id: func.id,
            funcionario: func.nome,
            cargo: cargo,
            filial: filial ? `Filial ${filial.id}` : 'Matriz', 
            id_filial: func.id_filial,
            salario: func.salario,
            status: 'Pendente', 
            metodo: 'Transferência' 
        };
    });

  } catch (err) {
    console.error('Erro ao listar projeção de salários:', err);
    throw err;
  }
};

const listarEntradasFinanceiro = async () => {
  try {
    const pedidos = await readAll('pedidos');
    const filiais = await readAll('filiais');
    const funcionarios = await readAll('funcionarios');

    return pedidos.map(ped => {
        const loja = filiais.find(f => f.id === ped.id_filial);
        const vendedor = funcionarios.find(f => f.id === ped.id_funcionario);

        return {
            id: ped.id,
            loja: loja ? loja.endereco.split('-')[0] : 'Loja Virtual', 
            id_filial: ped.id_filial,
            data: ped.criado,
            descricao: `Pedido #${ped.id}`,
            valor: ped.valor_total,
            formaPagamento: ped.metodo_pagamento,
            tipoEntrada: 'Venda',
            pedidoId: `PED-${ped.id}`,
            Registro: vendedor ? vendedor.nome.split(' ')[0] : 'Sistema' 
        };
    });
  } catch (err) {
    console.error('Erro ao listar entradas:', err);
    throw err;
  }
};
const obterDadosFluxoCaixa = async () => {
  try {
    const contas = await readAll('contas_pagar');
    
    const pedidos = await readAll('pedidos');
    
    const resumo = {
      entradas: 0,
      saidas: 0,
      saldo: 0,
      transacoes: contas.length + pedidos.length
    };

    resumo.entradas = pedidos.reduce((acc, item) => acc + Number(item.valor_total), 0);

    resumo.saidas = contas.reduce((acc, item) => {
        return acc + Number(item.valor);
    }, 0);

    resumo.saldo = resumo.entradas - resumo.saidas;

    return resumo;
  } catch (err) {
    console.error('Erro ao calcular fluxo de caixa:', err);
    throw err;
  }
};

export { listarSalariosProjecao, listarEntradasFinanceiro, obterDadosFluxoCaixa };