DROP DATABASE IF EXISTS molli;
CREATE DATABASE molli;
USE molli;

-- 1. FILIAIS
CREATE TABLE filiais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  foto_filial text, 
  cnpj varchar(20) UNIQUE,
  endereco text,
  telefone varchar(30),
  email text NOT NULL,
  ativo boolean DEFAULT true,
  criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. FUNÇÕES
CREATE TABLE funcoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcao VARCHAR(150) NOT NULL
);

-- 3. FUNCIONÁRIOS
CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(300) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(170) NOT NULL,
    senha TEXT NOT NULL,
    id_filial INT NOT NULL,
    id_funcao INT NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    ativo boolean DEFAULT true,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_func_filial FOREIGN KEY (id_filial) REFERENCES filiais(id),
    CONSTRAINT fk_func_funcao FOREIGN KEY (id_funcao) REFERENCES funcoes(id)
);

-- 4. CATEGORIAS
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);

-- 5. FORNECEDORES
CREATE TABLE fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  cnpj VARCHAR(20) UNIQUE,
  telefone VARCHAR(30),
  endereco TEXT,
  categoria VARCHAR(150),
  criado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. PRODUTOS
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  id_categoria INT NOT NULL,
  preco_venda DECIMAL(12,2) NOT NULL DEFAULT 0,
  preco_custo DECIMAL(12,2) NOT NULL DEFAULT 0,
  imagem TEXT NOT NULL,
  criado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- 7. ESTOQUE
CREATE TABLE estoque (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_produto INT NOT NULL,
  id_filial INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 0,
  atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  atualizado_por TEXT NULL DEFAULT('Bruno Almeida (Matriz)'),
  CONSTRAINT fk_estoque_prod FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
  CONSTRAINT fk_estoque_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON DELETE CASCADE,
  UNIQUE(id_produto, id_filial)
);

-- 8. PDV
CREATE TABLE pdv (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_funcionario INT NOT NULL,
  id_filial INT NOT NULL,
  criado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechado DATETIME NULL,
  total_vendas DECIMAL(10, 2) DEFAULT 0.00,
  qtd_vendas INT DEFAULT 0,
  ticket_medio DECIMAL(10, 2) DEFAULT 0.00,
  CONSTRAINT fk_pdv_func FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id),
  CONSTRAINT fk_pdv_filial FOREIGN KEY (id_filial) REFERENCES filiais(id)
);

-- 9. PEDIDOS
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_funcionario INT NOT NULL,
  id_pdv INT NOT NULL,
  id_filial INT NOT NULL,
  valor_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  metodo_pagamento ENUM('crédito', 'débito', 'pix') NOT NULL,
  lucro DECIMAL(12,2) NULL,
  parcelas TEXT NULL,
  criado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedido_func FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id),
  CONSTRAINT fk_pedido_pdv FOREIGN KEY (id_pdv) REFERENCES pdv(id),
  CONSTRAINT fk_pedido_filial FOREIGN KEY (id_filial) REFERENCES filiais(id)
);

-- 10. ITENS DO PEDIDO
CREATE TABLE pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_itens_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_itens_produto FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

-- 11. CONTAS A PAGAR 
CREATE TABLE contas_pagar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  vencimento DATE NOT NULL,
  status ENUM('Pendente','Pago','Atrasado') DEFAULT 'Pendente',
  id_filial INT NOT NULL,
  criado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_contas_filial FOREIGN KEY (id_filial) REFERENCES filiais(id)
);

-- 12. FINANCEIRO (Fluxo de Caixa)
CREATE TABLE financeiro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Entrada','Saida') NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  descricao TEXT,
  data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_pedido INT,
  id_conta_pagar INT,
  id_filial INT,
  CONSTRAINT fk_fin_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE SET NULL,
  CONSTRAINT fk_fin_conta FOREIGN KEY (id_conta_pagar) REFERENCES contas_pagar(id) ON DELETE SET NULL
);

-- 13. Solicitações (Solicitações da filial de produtos para matriz)
CREATE TABLE solicitacoes_estoque (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_filial INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL,
  status ENUM('Pendente', 'Enviado') DEFAULT 'Pendente',
  observacao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_solic_filial FOREIGN KEY (id_filial) REFERENCES filiais(id),
  CONSTRAINT fk_solic_prod FOREIGN KEY (id_produto) REFERENCES produtos(id)
);