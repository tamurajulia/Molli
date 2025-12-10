import { 
    listarContas, 
    criarConta, 
    atualizarConta, 
    excluirConta, 
    buscarContaPorId 
} from '../models/Contas.js';

const listarContasController = async (req, res) => {
    const { status } = req.query;
    
    const { id_filial, id_funcao } = req.func; 

    try {
        let filialParaBuscar = id_filial;
        if (Number(id_filial) === 1 || Number(id_funcao) === 1) {
            filialParaBuscar = null; 
        }

        const contas = await listarContas(filialParaBuscar, status);
        res.status(200).json(contas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao listar contas' });
    }
};

const buscarContaController = async (req, res) => {
    const { id } = req.params;
    try {
        const conta = await buscarContaPorId(id);
        if (!conta) return res.status(404).json({ mensagem: 'Conta não encontrada' });
        res.status(200).json(conta);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao buscar conta' });
    }
};

const criarContaController = async (req, res) => {
    const { descricao, valor, vencimento, status, id_filial } = req.body;
    const usuarioLogado = req.func;

    if (!descricao || !valor || !vencimento) {
        return res.status(400).json({ mensagem: 'Preencha os campos obrigatórios' });
    }

    try {
        const novaConta = {
            descricao,
            valor: Number(valor),
            vencimento,
            status: status || 'Pendente',
            id_filial: id_filial || usuarioLogado.id_filial
        };

        const id = await criarConta(novaConta);
        res.status(201).json({ mensagem: 'Conta criada com sucesso', id });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao criar conta' });
    }
};

const atualizarContaController = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    try {
        await atualizarConta(id, dados);
        res.status(200).json({ mensagem: 'Conta atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao atualizar conta' });
    }
};

const excluirContaController = async (req, res) => {
    const { id } = req.params;
    try {
        await excluirConta(id);
        res.status(200).json({ mensagem: 'Conta excluída' });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao excluir conta' });
    }
};

export { 
    listarContasController, 
    buscarContaController, 
    criarContaController, 
    atualizarContaController, 
    excluirContaController 
};