import { listarPedidosPorFilial } from '../models/VendasFilial.js';

const obterQuantidadesPedidos = async (req, res) => {
    const { id_filial } = req.func; 

    try {
        const pedidos = await listarPedidosPorFilial(id_filial);

        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        
        const qtdHoje = pedidos.filter(p => {
            const dataPedido = new Date(p.criado);
            return dataPedido.getDate() === hoje.getDate() &&
                   dataPedido.getMonth() === mesAtual &&
                   dataPedido.getFullYear() === anoAtual;
        }).length;

        const qtdMes = pedidos.filter(p => {
            const dataPedido = new Date(p.criado);
            return dataPedido.getMonth() === mesAtual &&
                   dataPedido.getFullYear() === anoAtual;
        }).length;

        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 7); 
        seteDiasAtras.setHours(0, 0, 0, 0); 

        const qtdSemana = pedidos.filter(p => {
            const dataPedido = new Date(p.criado);
            return dataPedido >= seteDiasAtras;
        }).length;
        
        res.json({
            qtd_hoje: qtdHoje,
            qtd_semana: qtdSemana,
            qtd_mes: qtdMes,
            pedidos_lista: pedidos
        });

    } catch (err) {
        console.error('Erro ao obter quantidades de pedidos:', err);
        res.status(500).json({ mensagem: 'Erro interno ao calcular vendas.' });
    }
};

export { obterQuantidadesPedidos };