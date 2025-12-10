USE molli;

INSERT INTO filiais (cnpj, endereco, telefone, email, ativo)
VALUES 
('12.345.678/0001-90', 'Rua São Paulo, 123 - Centro, Rio de Janeiro - RJ', '1199999-0000', 'matriz@molli.com', true),
('12.345.678/0001-91', 'Rua Exemplo, 123 - Leblon - AM', '1199999-0010', 'leblon.rj@molli.com', true),
('12.345.678/0001-92', 'Rua Caixias, 123 - Caixias - RS', '1199999-0020', 'caixias.rs@molli.com', true);

INSERT INTO funcoes (funcao)
VALUES
('Matriz'),
('Gerente'),
('Estoquista'),
('Caixa');

INSERT INTO funcionarios (nome, cpf, telefone, email, senha, id_filial, id_funcao, salario, ativo)
VALUES
('Bruno Almeida', '1', '1198888-1111', 'bruno.almeida@empresa.com', '$2b$10$JvD1.2MQewb42/YYFbOHdOrdtrYnNDkAbDEmPWdaxUOcrBjXuPm1a', 1, 1, 5500.00, true),
('Fabio Santos', '2', '1198888-2222', 'fabio.santos@empresa.com', '$2b$10$JvD1.2MQewb42/YYFbOHdOrdtrYnNDkAbDEmPWdaxUOcrBjXuPm1a', 2, 2, 4700.00, true),
('Marcos Pereira', '3', '1198888-3333', 'marcos.pereira@empresa.com', '$2b$10$JvD1.2MQewb42/YYFbOHdOrdtrYnNDkAbDEmPWdaxUOcrBjXuPm1a', 2, 3, 2200.00, true),
('João Oliveira', '4', '1198888-4444', 'joao.oliveira@empresa.com', '$2b$10$JvD1.2MQewb42/YYFbOHdOrdtrYnNDkAbDEmPWdaxUOcrBjXuPm1a', 2, 4, 2200.00, true),
('Ana Clara', '5', '1198888-5555', 'ana.clara@empresa.com', '$2b$10$JvD1.2MQewb42/YYFbOHdOrdtrYnNDkAbDEmPWdaxUOcrBjXuPm1a', 3, 2, 4500.00, true),
('Pedro Souza', '6', '1198888-6666', 'pedro.souza@empresa.com', '$2b$10$JvD1.2MQewb42/YYFbOHdOrdtrYnNDkAbDEmPWdaxUOcrBjXuPm1a', 3, 4, 2200.00, true);


INSERT INTO categorias (nome) VALUES 
('Acessório'),
('Roupa'),
('Cuidado'),
('Conforto');

INSERT INTO produtos (nome, descricao, preco_venda, preco_custo, imagem, id_categoria) VALUES
-- Roupas Femininas (Categoria 2) - IDs 1 a 14
('Vestido Flor de Algodão', 'Peça em tom rosa claro com estampa floral delicada, feita com algodão macio que garante conforto prolongado.', 59.90, 28.00, 'VestidoP1.png', 2),
('Vestido Primavera Doce', 'Modelo primavera produzido com tecido leve e fresco, ideal para dias quentes. O laço frontal adiciona charme.', 64.90, 30.00, 'VestidoP2.png', 2),
('Vestido Encanto Rosa', 'Peça em tom rosa bebê com detalhes rendados finos que acrescentam elegância. Saia com volume suave.', 69.90, 32.00, 'VestidoP3.png', 2),
('Body Rosa Confort', 'Tecido macio de algodão com ótima respirabilidade, toque suave na pele e botões reforçados.', 29.90, 12.00, 'BodyFemininoP1.png', 2),
('Body Flores Delicadas', 'Material leve com estampa de flores coloridas que trazem alegria ao visual.', 32.90, 14.00, 'BodyFemininoP2.png', 2),
('Body Princesinha', 'Modelo em tom rosa bebê delicado e gola arredondada. Tecido macio e confortável.', 34.90, 15.00, 'BodyFemininoP3.png', 2),
('Macacão Rosa Suave', 'Confeccionado com tecido antialérgico de toque macio e estampa de nuvens.', 69.90, 33.00, 'MacacaoFeminoP1.png', 2),
('Macacão Gatinho Branco', 'Material macio e aconchegante com fecho frontal prático. Textura suave.', 74.90, 36.00, 'MacacaoFemininoP2.png', 2),
('Casaco Pelúcia Rosa Doçura', 'Pelo extremamente macio com textura aveludada e interior quentinho, perfeito para dias frios.', 89.90, 42.00, 'CasaquinhoFeminoP2.png', 2),
('Casaco Pelúcia Bege Conforto', 'Material com toque aveludado, fechamento frontal prático e excelente isolamento térmico.', 96.90, 46.00, 'CasaquinhoFemininoP1.png', 2),
('Calça Rosa Macia', 'Tecido de toque suave e cintura elástica que não aperta.', 29.90, 12.00, 'CalcaFemininoP1.png', 2),
('Calça Conforto Rosa Claro', 'Modelo produzido com tecido respirável e superfície macia.', 34.90, 15.00, 'CalcaFemininoP2.png', 2),
('Camiseta Rosa Laços', 'Malha leve com estampa delicada de laços. Toque macio e agradável.', 24.90, 10.00, 'CamisetaFemininaP1.png', 2),
('Camiseta Doce Flor', 'Material macio em tom rosa bebê com ilustração floral sutil.', 26.90, 11.00, 'CamisetaFemininaP2.png', 2),

-- Acessórios / Toucas e Babadores (Categoria 1) - IDs 15 a 20
('Touca Preta Molli', 'Tecido macio que protege do vento e mantém o bebê aquecido.', 19.90, 7.00, 'ToucaP4.png', 1),
('Touca Rosa Molli', 'Tecido suave ideal para recém-nascidos, proporcionando conforto térmico.', 19.90, 7.00, 'ToucaP3.png', 1),
('Touca Azul Molli', 'Material leve ao toque e super confortável, ideal para dias mais frescos.', 19.90, 7.00, 'ToucaP2.png', 1),
('Touca Branca Molli', 'Modelo antialérgico com toque macio e superfície delicada que evita irritações.', 19.90, 7.00, 'ToucaP1.png', 1),
('Babador Rosa Simples', 'Superfície absorvente que ajuda a manter a roupa limpa durante as refeições.', 16.90, 6.00, 'BabadorP2.png', 1),
('Babador Azul Simples', 'Produzido com tecido absorvente e confortável, ideal para uso diário.', 16.90, 6.00, 'BabadorP1.png', 1),

-- Roupas Masculinas/Unissex (Categoria 2) - IDs 21 a 29
('Casaco Azul Explorador', 'Material quentinho com capuz e forro interno macio.', 84.90, 38.00, 'CasacoMasculinoP2.png', 2),
('Casaco Azul Clássico', 'Superfície macia, ótima retenção de calor e acabamento elegante.', 89.90, 40.00, 'CasacoMasculinoP1.png', 2),
('Body Azul Marinho Baby', 'Tecido respirável com excelente elasticidade e botões reforçados.', 32.90, 14.00, 'BodyMasculinoP2.png', 2),
('Body Azul Céu Fofo', 'Algodão premium de toque muito macio que garante suavidade extrema na pele do bebê.', 32.90, 14.00, 'BodyMasculinoP1.png', 2),
('Body Verde Floresta', 'Tecido confortável com estampa temática. Material leve que permite ventilação.', 34.90, 15.00, 'BodyMasculinoP3.png', 2),
('Calça Preta Básica', 'Material flexível, cintura elástica confortável e toque macio.', 29.90, 12.00, 'CalcaMasculinoP1.png', 2),
('Calça Azul Conforto', 'Produzida em algodão reforçado, possui toque suave e boa resistência.', 29.90, 12.00, 'CalcaMasculinoP2.png', 2),
('Camiseta Azul Ursinho', 'Malha macia com estampa de ursinho que deixa o visual encantador.', 24.90, 10.00, 'CamisetaMasculinaP2.png', 2),
('Camiseta Dino', 'Material leve com ilustração divertida de dinossauro.', 26.90, 11.00, 'CamisetaMasculinaP1.png', 2),

-- Calçados e Chupetas (Categoria 1) - IDs 30 a 35
('Sapatinho Branco Menina', 'Modelo macio com interior acolchoado e sola antiderrapante.', 39.90, 18.00, 'SapatoP1.png', 1),
('Sapatinho Branco Tênis', 'Design confortável com fechamento em velcro que facilita o uso diário.', 39.90, 18.00, 'SapatoP2.png', 1),
('Chupeta Rosa Molli', 'Acessório com bico anatômico e material seguro, ideal para acalmar.', 14.90, 5.00, 'ChupetaP3.png', 1),
('Chupeta Verde Molli', 'Possui design ergonômico que ajuda no encaixe natural.', 14.90, 5.00, 'ChupetaP4.png', 1),
('Chupeta Branca Molli', 'Produzida com material macio e higiênico, oferece encaixe suave.', 14.90, 5.00, 'ChupetaP1.png', 1),
('Chupeta Azul Molli', 'Estrutura leve com furos respiráveis que evitam acúmulo de umidade.', 14.90, 5.00, 'ChupetaP2.png', 1),

-- Mamadeiras (Categoria 3) - IDs 36 a 38
('Mamadeira Mini 120ml', 'Modelo compacto ideal para recém-nascidos, com bico ortodôntico.', 24.90, 11.00, 'MamadeiraP1.png', 3),
('Mamadeira Média 240ml', 'Tamanho intermediário com fluxo suave e sistema que reduz engasgos.', 29.90, 13.00, 'MamadeiraP2.png', 3),
('Mamadeira Grande 300ml', 'Capacidade ampliada e sistema anticólica que torna as mamadas mais tranquilas.', 34.90, 15.00, 'MamadeiraP3.png', 3),

-- Conforto e Brinquedos (Categoria 4) - IDs 39 a 49
('Cobertor Gatinha Rosa', 'Tecido macio e aconchegante com capuz temático que mantém o bebê quentinho.', 69.90, 30.00, 'MataP3.png', 4),
('Cobertor Ursinho Bege', 'Superfície aveludada com capuz decorativo, proporcionando calor suave.', 69.90, 30.00, 'MataP4.png', 4),
('Cobertor Cachorro Azul', 'Material macio que envolve o bebê oferecendo segurança térmica.', 69.90, 30.00, 'MataP2.png', 4),
('Almofada Bege Macia', 'Enchimento antialérgico que proporciona conforto e suporte para a cabecinha.', 29.90, 12.00, 'TravesseiroP3.png', 4),
('Almofada Azul Baby', 'Tecido suave com enchimento leve que oferece bem-estar.', 29.90, 12.00, 'TravesseiroP1.png', 4),
('Almofada Rosa Bebê', 'Modelo macio com toque delicado que se adapta bem ao uso diário.', 29.90, 12.00, 'TravesseiroP2.png', 4),
('Almofada Verde Leve', 'Textura suave e enchimento antialérgico que garante segurança e conforto.', 29.90, 12.00, 'TravesseiroP4.png', 4),
('Brinquedo Girafa', 'Chocalho leve com textura macia e design encantador.', 24.90, 10.00, 'BrinquedoP1.png', 4),
('Brinquedo Polvo', 'Acessório de silicone com formato divertido, ideal para aliviar a gengiva.', 19.90, 8.00, 'BrinquedoP2.png', 4),
('Brinquedo Elefantinho', 'Pelúcia pequena e ultra macia, pensada para oferecer aconchego.', 34.90, 15.00, 'BrinquedoP3.png', 4),
('Brinquedo Pandeiro', 'Brinquedo educativo com som suave e formato seguro.', 34.90, 15.00, 'BrinquedoP4.png', 4),

-- Higiene (Categoria 3) - IDs 50 a 56
('Shampoo Molli Baby', 'Fórmula hipoalergênica desenvolvida para limpar suavemente sem irritar.', 16.90, 7.00, 'HigieneP1.png', 3),
('Essência Molli Baby', 'Fragrância delicada que proporciona sensação de aconchego.', 14.90, 6.00, 'HigieneP2.png', 3),
('Cotonete Molli Seguro', 'Ponta com formato especial que impede profundidade excessiva.', 9.90, 4.00, 'HigieneP3.png', 3),
('Kit Escova + Creme Molli', 'Conjunto prático com escova macia e creme hidratante suave.', 22.90, 9.00, 'HigieneP4.png', 3),
('Pente Molli Azul', 'Design com pontas arredondadas que deslizam suavemente pelos fios.', 7.90, 3.00, 'HigieneP7.png', 3),
('Pente Molli Rosa', 'Modelo resistente com formato ergonômico que facilita o manuseio.', 7.90, 3.00, 'HigieneP6.png', 3),
('Pente Molli Verde', 'Produto leve com estrutura confortável, ideal para desembaraçar com delicadeza.', 7.90, 3.00, 'HigieneP5.png', 3);


-- Inserção de Estoque (100 unidades para cada produto em 2 filiais)
-- IDs 1 ao 56
INSERT INTO estoque (id_produto, id_filial, quantidade) VALUES
-- Filial 1
(1, 1, 100), (2, 1, 100), (3, 1, 100), (4, 1, 100), (5, 1, 100), (6, 1, 100), (7, 1, 100), (8, 1, 100), (9, 1, 100), (10, 1, 100),
(11, 1, 100), (12, 1, 100), (13, 1, 100), (14, 1, 100), (15, 1, 100), (16, 1, 100), (17, 1, 100), (18, 1, 100), (19, 1, 100), (20, 1, 100),
(21, 1, 100), (22, 1, 100), (23, 1, 100), (24, 1, 100), (25, 1, 100), (26, 1, 100), (27, 1, 100), (28, 1, 100), (29, 1, 100), (30, 1, 100),
(31, 1, 100), (32, 1, 100), (33, 1, 100), (34, 1, 100), (35, 1, 100), (36, 1, 100), (37, 1, 100), (38, 1, 100), (39, 1, 100), (40, 1, 100),
(41, 1, 100), (42, 1, 100), (43, 1, 100), (44, 1, 100), (45, 1, 100), (46, 1, 100), (47, 1, 100), (48, 1, 100), (49, 1, 100), (50, 1, 100),
(51, 1, 100), (52, 1, 100), (53, 1, 100), (54, 1, 100), (55, 1, 100), (56, 1, 100),

-- Filial 2
(1, 2, 100), (2, 2, 100), (3, 2, 100), (4, 2, 100), (5, 2, 100), (6, 2, 100), (7, 2, 100), (8, 2, 100), (9, 2, 100), (10, 2, 100),
(11, 2, 100), (12, 2, 100), (13, 2, 100), (14, 2, 100), (15, 2, 100), (16, 2, 100), (17, 2, 100), (18, 2, 100), (19, 2, 100), (20, 2, 100),
(21, 2, 100), (22, 2, 100), (23, 2, 100), (24, 2, 100), (25, 2, 100), (26, 2, 100), (27, 2, 100), (28, 2, 100), (29, 2, 100), (30, 2, 100),
(31, 2, 100), (32, 2, 100), (33, 2, 100), (34, 2, 100), (35, 2, 100), (36, 2, 100), (37, 2, 100), (38, 2, 100), (39, 2, 100), (40, 2, 100),
(41, 2, 100), (42, 2, 100), (43, 2, 100), (44, 2, 100), (45, 2, 100), (46, 2, 100), (47, 2, 100), (48, 2, 100), (49, 2, 100), (50, 2, 100),
(51, 2, 100), (52, 2, 100), (53, 2, 100), (54, 2, 100), (55, 2, 100), (56, 2, 100);

INSERT INTO contas_pagar (descricao, valor, vencimento, status, id_filial) VALUES
-- Filial 1 (Matriz) - Foco em Administrativo e Marketing
('Aluguel Escritório Central', 5500.00, '2025-11-05', 'Pago', 1),
('Licença Software ERP', 1200.00, '2025-11-10', 'Pago', 1),
('Campanha Marketing Instagram', 3200.00, '2025-11-15', 'Pendente', 1),
('Energia Elétrica Matriz', 980.50, '2025-11-20', 'Pendente', 1),
('Servidor AWS', 450.00, '2025-11-01', 'Atrasado', 1),
('Consultoria Contábil', 2500.00, '2025-11-30', 'Pendente', 1),

-- Filial 2 (Leblon - RJ) - Custo alto de operação
('Aluguel Loja Leblon', 12500.00, '2025-11-05', 'Pago', 2),
('Reposição Estoque (Mimos Baby)', 4500.00, '2025-11-12', 'Pago', 2),
('Energia Elétrica Leblon', 2100.20, '2025-11-20', 'Pendente', 2),
('Serviço de Limpeza Terceirizado', 1800.00, '2025-11-25', 'Pendente', 2),
('Manutenção Vitrine', 650.00, '2025-11-02', 'Atrasado', 2),

-- Filial 3 (Caxias - RS) - Operação média
('Aluguel Loja Caxias', 3800.00, '2025-11-05', 'Pago', 3),
('Fornecedor Brinquedos Ltda', 2800.00, '2025-11-15', 'Pendente', 3),
('Energia Elétrica Caxias', 750.00, '2025-11-20', 'Pendente', 3),
('Internet Fibra Óptica', 150.00, '2025-11-10', 'Pago', 3),
('Taxa de Associação Comercial', 120.00, '2025-11-30', 'Pendente', 3);

INSERT INTO fornecedores (nome, cnpj, telefone, endereco, categoria) VALUES
('Mimos Baby Ltda', '45.123.000/0001-99', '113333-4444', 'Rua das Malhas, 500', 'Roupas'),
('Plastic Kids', '56.789.000/0001-11', '113333-5555', 'Av Industrial, 200', 'Brinquedos'),
('Higiene Pura', '12.345.000/0001-22', '113333-6666', 'Rua Limpa, 10', 'Cuidado');

INSERT INTO pdv (id_funcionario, id_filial, criado, fechado, total_vendas) VALUES
(3, 2, '2025-10-01 08:00:00', '2025-10-01 18:00:00', 1250.00), -- Marcos (Leblon)
(4, 2, '2025-10-01 08:00:00', '2025-10-01 18:00:00', 980.00),  -- João (Leblon)
(6, 3, '2025-10-01 09:00:00', '2025-10-01 19:00:00', 1500.00); -- Pedro (Caxias)

INSERT INTO pedidos (id_funcionario, id_pdv, id_filial, valor_total, metodo_pagamento, criado) VALUES
(3, 1, 2, 150.00, 'crédito', NOW()), -- Venda Agora
(3, 1, 2, 89.90, 'pix', DATE_SUB(NOW(), INTERVAL 2 HOUR)), -- 2 horas atrás
(4, 2, 2, 220.00, 'débito', DATE_SUB(NOW(), INTERVAL 1 DAY)), -- Ontem
(3, 1, 2, 45.00, 'pix', DATE_SUB(NOW(), INTERVAL 2 DAY)), -- 2 dias atrás
(4, 2, 2, 310.00, 'crédito', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 1, 2, 120.00, 'pix', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 1, 2, 500.00, 'crédito', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 2, 2, 65.00, 'débito', DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Filial 3 (Caxias) - Vendas recentes
INSERT INTO pedidos (id_funcionario, id_pdv, id_filial, valor_total, metodo_pagamento, criado) VALUES
(6, 3, 3, 200.00, 'crédito', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(6, 3, 3, 150.50, 'débito', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 3, 3, 800.00, 'pix', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 3, 3, 45.90, 'pix', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 3, 3, 320.00, 'crédito', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Matriz (Vendas Online) - Vendas recentes
INSERT INTO pedidos (id_funcionario, id_pdv, id_filial, valor_total, metodo_pagamento, criado) VALUES
(1, 1, 1, 1200.00, 'crédito', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 1, 1, 2500.00, 'pix', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 3. REPOPULAR O FINANCEIRO (Para o card de "Total Consolidado" atualizar)
INSERT INTO financeiro (tipo, valor, descricao, data_movimento, id_pedido, id_filial)
SELECT 'Entrada', valor_total, CONCAT('Pedido #', id), criado, id, id_filial FROM pedidos;

INSERT INTO solicitacoes_estoque (id_filial, id_produto, quantidade, status, observacao) VALUES
(2, 1, 50, 'Pendente', 'Estoque baixo de vestidos'),
(2, 4, 20, 'Enviado', 'Reposição de inverno'),
(3, 7, 30, 'Pendente', 'Urgente');
