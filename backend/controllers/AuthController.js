import jwt from 'jsonwebtoken';
import { read, compare } from '../config/database.js';
import { JWT_SECRET } from '../config/jwt.js';

const loginController = async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    const usuario = await read('funcionarios', `cpf = '${cpf}'`);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaCorreta = await compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha Incorreta' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        id_funcao: usuario.id_funcao,
        id_filial: usuario.id_filial,
        ativo: usuario.funcionario_ativo,
      },
      JWT_SECRET,
      {
        expiresIn: '10h',
      }
    );

    const id_user = usuario.id;

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      id_user,
      nome: usuario.nome,
      id_funcao: usuario.id_funcao,
      id_filial: usuario.id_filial,
    });
  } catch (err) {
    console.error(`Erro ao realizar login: `, err);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
};

export { loginController };
