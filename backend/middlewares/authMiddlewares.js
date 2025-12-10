import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const authMiddleware = (req, res, next) => {
  const authHeader = `Bearer ${req.headers.authorization}`;

  if (!authHeader) {
    return res
      .status(401)
      .json({ mensagem: 'Não autorizado: Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.func = {
      id: decoded.id,
      nome: decoded.nome,
      cpf: decoded.cpf,
      id_funcao: decoded.id_funcao,
      id_filial: decoded.id_filial,
      ativo: decoded.ativo,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(498).json({ mensagem: 'Login expirado' });
    }
    console.log(err);
    return res.status(403).json({ mensagem: 'Não autorizado: Token invávido' });
  }
};

export default authMiddleware;
