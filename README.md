# 🧸 Molli — Sistema de Gestão para Rede de Lojas Infantis

**Molli** é um Sistema ERP (Enterprise Resource Planning) desenvolvido como Trabalho de Conclusão de Curso (TCC).  
Seu objetivo é gerenciar uma **rede de lojas (Matriz e Filiais)** focada em produtos infantis, centralizando processos de:

✔ Financeiro  
✔ Estoque  
✔ Vendas (PDV)  
✔ Recursos Humanos  
✔ Operações de Matriz e Filiais

---

## 🚀 Funcionalidades Principais

O sistema possui **dois painéis principais**:  
**Matriz (Admin Global)** e **Filial (Gerência Local)**.

---

## 🏢 Painel da Matriz (Admin Global)

- **Dashboard Executivo**  
  KPIs em tempo real: Faturamento, Lucro, Crescimento, Gráficos e Heatmaps.

- **Gestão de Filiais**  
  Cadastro, edição, ativação/desativação e acompanhamento de performance.

- **Financeiro Central**  
  Contas a pagar, recebíveis, fluxo de caixa consolidado e relatórios.

- **Produtos e Categorias**  
  Cadastro global de produtos e distribuição para filiais.

- **Relatórios**  
  Exportação em **PDF e CSV** (Vendas, Financeiro e Estoque).

---

## 🏪 Painel da Filial (Gerente de Loja)

- **Dashboard Local**  
  Vendas da unidade, metas e comparativos.

- **PDV (Ponto de Venda)**  
  Interface rápida para venda com cálculo automático e emissão de pedidos.

- **Estoque Local**  
  Consulta de estoque da loja e solicitação de reposição para a Matriz.

- **Equipe (Funcionários)**  
  Cadastro, escala, permissões e comissões.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- **Next.js (React)**
- **CSS Modules**
- **Tailwind CSS**
- **Chart.js**
- **Lucide React**
- **jspdf + html2pdf.js**

### Back-end
- **Node.js**
- **Express.js**
- **MySQL**
- **mysql2**
- **JWT**
- **bcrypt**
- **Multer**

---

## 📂 Estrutura do Banco de Dados (MySQL)

As principais tabelas incluem:

### 🔹 Estrutura Organizacional
- `filiais`
- `funcionarios`

### 🔹 Gestão de Produtos
- `produtos`
- `categorias`
- `estoque`

### 🔹 Vendas e PDV
- `pedidos`
- `pedido_itens`
- `pdv`

### 🔹 Financeiro
- `contas_pagar`
- `financeiro`

### 🔹 Logística
- `solicitacoes_estoque`

---

## 🔧 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado  
- MySQL instalado e rodando  

---

### 1️⃣ Configurar o Banco de Dados

1. Crie um banco chamado **`molli`**
2. Execute o arquivo **`database.sql`** incluído no projeto

---

### 2️⃣ Rodar o Back-end

```sh
cd backend
npm install
npm start
# Servidor em: http://localhost:3001
3️⃣ Rodar o Front-end
```
cd frontend
npm install
npm run dev
# Aplicação em: http://localhost:3000

👥 Autores
Trabalho desenvolvido por:
Eduarda Alves Pinho - N°08
Isabela Alves - N°15
Isabelli Lopes Montenegro - N°17	
Julia Tamura De Oliveira Silva - N°20
Yasmin Alencar da Silva - N°32

Projeto integrador acadêmico — SENAI SCS 2025
