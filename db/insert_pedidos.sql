use molli;
-- PEDIDO 1 - id_funcionario 3, id_pdv 1, id_filial 2, valor_total 150.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(1, 1, 1, 59.90, 59.90),
(1, 15, 2, 19.90, 39.80),
(1, 4, 1, 29.90, 29.90),
(1, 36, 1, 24.90, 24.90);
UPDATE pedidos SET lucro = (59.90-28) + (19.90-7)*2 + (29.90-12) + (24.90-11) WHERE id = 1;

-- PEDIDO 2 - valor_total 89.90
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(2, 2, 1, 64.90, 64.90),
(2, 16, 1, 16.90, 16.90),
(2, 3, 1, 69.90, 69.90);
UPDATE pedidos SET lucro = (64.90-30)+(16.90-6)+(69.90-32) WHERE id = 2;

-- PEDIDO 3 - valor_total 220.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(3, 21, 2, 84.90, 169.80),
(3, 5, 1, 32.90, 32.90),
(3, 30, 1, 39.90, 39.90);
UPDATE pedidos SET lucro = (84.90-38)*2 + (32.90-14) + (39.90-18) WHERE id = 3;

-- PEDIDO 4 - valor_total 45.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(4, 12, 1, 34.90, 34.90),
(4, 17, 1, 29.90, 29.90);
UPDATE pedidos SET lucro = (34.90-15) + (29.90-12) WHERE id = 4;

-- PEDIDO 5 - valor_total 310.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(5, 9, 2, 89.90, 179.80),
(5, 14, 2, 26.90, 53.80),
(5, 39, 1, 69.90, 69.90);
UPDATE pedidos SET lucro = (89.90-42)*2 + (26.90-11)*2 + (69.90-30) WHERE id = 5;

-- PEDIDO 6 - valor_total 120.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(6, 7, 1, 69.90, 69.90),
(6, 18, 1, 34.90, 34.90),
(6, 36, 1, 24.90, 24.90);
UPDATE pedidos SET lucro = (69.90-33) + (34.90-15) + (24.90-11) WHERE id = 6;

-- PEDIDO 7 - valor_total 500.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(7, 10, 2, 96.90, 193.80),
(7, 22, 3, 89.90, 269.70),
(7, 37, 1, 29.90, 29.90);
UPDATE pedidos SET lucro = (96.90-46)*2 + (89.90-40)*3 + (29.90-13) WHERE id = 7;

-- PEDIDO 8 - valor_total 65.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(8, 6, 1, 34.90, 34.90),
(8, 31, 1, 39.90, 39.90);
UPDATE pedidos SET lucro = (34.90-15) + (39.90-18) WHERE id = 8;

-- PEDIDO 9 - id_filial 3 - valor_total 200.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(9, 36, 2, 24.90, 49.80),
(9, 39, 2, 69.90, 139.80),
(9, 50, 1, 16.90, 16.90);
UPDATE pedidos SET lucro = (24.90-11)*2 + (69.90-30)*2 + (16.90-7) WHERE id = 9;

-- PEDIDO 10 - valor_total 150.50
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(10, 37, 1, 34.90, 34.90),
(10, 40, 1, 29.90, 29.90),
(10, 41, 2, 34.90, 69.80);
UPDATE pedidos SET lucro = (34.90-15) + (29.90-12) + (34.90-15)*2 WHERE id = 10;

-- PEDIDO 11 - valor_total 800.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(11, 9, 4, 89.90, 359.60),
(11, 42, 3, 34.90, 104.70),
(11, 43, 2, 29.90, 59.80),
(11, 44, 2, 29.90, 59.80),
(11, 45, 2, 29.90, 59.80);
UPDATE pedidos SET lucro = (89.90-42)*4 + (34.90-15)*3 + (29.90-12)*4 WHERE id = 11;

-- PEDIDO 12 - valor_total 45.90
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(12, 46, 1, 29.90, 29.90),
(12, 47, 1, 16.00, 16.00);
UPDATE pedidos SET lucro = (29.90-12) + (16.00-6) WHERE id = 12;

-- PEDIDO 13 - valor_total 320.00
INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario, total) VALUES
(13, 8, 1, 74.90, 74.90),
(13, 48, 2, 69.90, 139.80),
(13, 49, 1, 34.90, 34.90),
(13, 50, 2, 16.90, 33.80);
UPDATE pedidos SET lucro = (74.90-36) + (69.90-33)*2 + (34.90-12) + (16.90-6)*2 WHERE id = 13;
