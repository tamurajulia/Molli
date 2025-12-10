import {
  listarFilial,
  criarFilial,
  atualizarFilial,
  excluirFilial,
  obterFilialPorId,
} from '../models/Filial.js';

const listarFilialController = async (req, res) => {
  try {
    const filiais = await listarFilial();

    res.status(200).json(filiais);
  } catch (err) {
    console.error('Erro ao listar filiais: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar filiais' });
  }
};

const obterFilialController = async (req, res) => {
  const { id } = req.params;
  try {
    const filial = await obterFilialPorId(id);
    if (!filial)
      return res.status(404).json({ mensagem: 'Filial não encontrada' });
    res.status(200).json(filial);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar filial' });
  }
};
const criarFilialController = async (req, res) => {
    if (!req.body) return res.status(400).json({ mensagem: 'Corpo da requisição vazio' });

    const { cnpj, endereco, telefone, email, ativo } = req.body;
    const foto = req.file ? req.file.path : null;

    try {
        if (!cnpj || !email) return res.status(400).json({ mensagem: 'CNPJ e Email são obrigatórios' });

        const novaFilial = { 
            cnpj, 
            endereco, 
            telefone, 
            email, 
            ativo: ativo ? Number(ativo) : 1,
            foto_filial: foto 
        };
        
        const id = await criarFilial(novaFilial);
        res.status(201).json({ mensagem: 'Filial criada com sucesso', id });
    } catch (err) {
        if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ mensagem: 'CNPJ já cadastrado' });
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao criar filial' });
    }
};

const atualizarFilialController = async (req, res) => {
    const { id } = req.params;
    
    const body = req.body || {}; 
    const { cnpj, endereco, telefone, email, ativo } = body;
    
    try {
        const dadosParaAtualizar = { 
            cnpj, 
            endereco, 
            telefone, 
            email, 
            ativo: ativo !== undefined ? Number(ativo) : undefined
        };

        if (req.file) {
            dadosParaAtualizar.foto_filial = req.file.path;
        }

        Object.keys(dadosParaAtualizar).forEach(key => 
            dadosParaAtualizar[key] === undefined && delete dadosParaAtualizar[key]
        );

        await atualizarFilial(id, dadosParaAtualizar);
        res.status(200).json({ mensagem: 'Filial atualizada com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao atualizar filial' });
    }
};

const excluirFilialController = async (req, res) => {
  const { id } = req.params;
  try {
    await excluirFilial(id);
    res.status(200).json({ mensagem: 'Filial excluída com sucesso' });
  } catch (err) {
    res.status(500).json({
      mensagem: 'Não é possível excluir filial com registros vinculados',
    });
  }
};

export {
  listarFilialController,
  obterFilialController,
  criarFilialController,
  atualizarFilialController,
  excluirFilialController,
};
