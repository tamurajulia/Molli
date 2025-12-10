import express from 'express';
const app = express();
const port = 3001;
import authRotas from './routes/authRotas.js';
import produtoRotas from './routes/produtosRotas.js';
import estoqueRotas from './routes/estoqueRotas.js';
import filialRotas from './routes/filialRotas.js';
import funcionarioRotas from './routes/funcionarioRotas.js';
import financeiroRotas from './routes/financeiroRotas.js';
import contasRotas from './routes/contasRotas.js';
import pedidoRotas from './routes/pedidoRotas.js';
import pdvRotas from './routes/pdvRotas.js';
import dashAdminRotas from './routes/dashAdminRotas.js';
import solicitacaoRotas from './routes/solicitacaoRotas.js';
import VendasFilialRotas from './routes/VendasFilialRotas.js';
import fornecedoresRotas from './routes/fornecedoresRotas.js';
import ProdutoMatrizRotas from './routes/ProdutoMatriz.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cors from 'cors';

app.use(cors());
app.use(express.json());

app.use('/auth', authRotas);
app.use('/produtos', produtoRotas);
app.use('/estoque', estoqueRotas);
app.use('/filial', filialRotas);
app.use('/funcionario', funcionarioRotas);
app.use('/financeiro', financeiroRotas);
app.use('/contas', contasRotas);
app.use('/pedido', pedidoRotas);
app.use('/pdv', pdvRotas);
app.use('/dashboard', dashAdminRotas);
app.use('/solicitacoes', solicitacaoRotas);
app.use('/vendas-filial', VendasFilialRotas);
app.use('/fornecedores', fornecedoresRotas);
app.use('/produtos-matriz', ProdutoMatrizRotas);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.status(200).send('API Molli funcionando!');
});

app.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota inválida ou não encontrada' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
