import bcrypt from 'bcryptjs';
import { readAll } from '../config/database.js';
import {
  obterFuncionarioPorId,
  obterFuncaoPorId,
  listarFuncionariosPorFilial,
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  buscarPorCpf
} from '../models/Funcionario.js';
import { obterFilialPorId } from '../models/Filial.js';

const obterFuncionarioPorIdController = async (req, res) => {
  try {
    const id = req.func.id; 
    const funcionario = await obterFuncionarioPorId(id);
    const funcao = await obterFuncaoPorId(funcionario.id_funcao);
    const filial = await obterFilialPorId(funcionario.id_filial);

    const funcionarioEnviar = {
      ...funcionario,
      cargo: funcao ? funcao.funcao : 'Desconhecido',
      endereco: filial ? filial.endereco : 'Matriz',
    };

    res.status(200).json(funcionarioEnviar);
  } catch (err) {
    console.error('Erro ao obter perfil: ', err);
    res.status(500).json({ mensagem: 'Erro ao obter perfil' });
  }
};

const listarTodosController = async (req, res) => {
    const { id_filial, id_funcao } = req.func; 

    try {
        let filialParaBuscar = id_filial;
        
        if (Number(id_funcao) === 1) {
            filialParaBuscar = null; 
        }

        const funcionarios = await listarFuncionariosPorFilial(filialParaBuscar);
        
        const funcoes = await readAll('funcoes');
        const listaFinal = funcionarios.map(func => ({
            ...func,
            cargo: funcoes.find(f => f.id === func.id_funcao)?.funcao || 'N/A'
        }));

        res.status(200).json(listaFinal);

    } catch (err) {
        console.error('Erro ao listar funcionários:', err);
        res.status(500).json({ mensagem: 'Erro ao listar funcionários' });
    }
};

const obterFuncionarioParaEditarController = async (req, res) => {
    const { id } = req.params; 
    try {
        const funcionario = await obterFuncionarioPorId(id);
        if (!funcionario) {
            return res.status(404).json({ mensagem: 'Funcionário não encontrado' });
        }
        delete funcionario.senha;
        res.status(200).json(funcionario);
    } catch (err) {
        console.error('Erro ao buscar funcionário:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar funcionário' });
    }
};

const criarFuncionarioController = async (req, res) => {
    const { nome, cpf, telefone, email, senha, id_filial, id_funcao, salario } = req.body;

    try {
        if (!nome || !cpf || !senha || !id_filial || !id_funcao) {
            return res.status(400).json({ mensagem: 'Preencha campos obrigatórios' });
        }

        const existe = await buscarPorCpf(cpf);
        if (existe) return res.status(400).json({ mensagem: 'CPF já cadastrado' });

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(senha, salt);

        const novoFunc = {
            nome, cpf, telefone, email,
            senha: hashSenha,
            id_filial, id_funcao, salario,
            ativo: 1
        };

        await criarFuncionario(novoFunc);
        res.status(201).json({ mensagem: 'Criado com sucesso' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar' });
    }
};

const atualizarFuncionarioController = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    try {
        if (dados.senha && dados.senha.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            dados.senha = await bcrypt.hash(dados.senha, salt);
        } else {
            delete dados.senha;
        }

        await atualizarFuncionario(id, dados);
        res.status(200).json({ mensagem: 'Atualizado com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao atualizar' });
    }
};

export { 
    obterFuncionarioPorIdController,
    obterFuncionarioParaEditarController,
    listarTodosController,
    criarFuncionarioController,
    atualizarFuncionarioController
};