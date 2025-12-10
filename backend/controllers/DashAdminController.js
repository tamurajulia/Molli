import { readAll } from '../config/database.js';

const obterResumoDashboard = async (req, res) => {
    try {
        const { id_filial } = req.func;

        if (!id_filial) {
            return res.status(400).json({ mensagem: "Filial não identificada no token." });
        }

        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();
        const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1;
        const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual;

        
        const pedidos = await readAll('pedidos', `id_filial = ${id_filial}`);
        const contas = await readAll('contas_pagar', `id_filial = ${id_filial} AND status = 'Pago'`);
        const funcionarios = await readAll('funcionarios', `id_filial = ${id_filial} AND ativo = 1`);

        const pedidosMes = pedidos.filter(p => {
            const d = new Date(p.criado);
            return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual;
        });

        const pedidosMesAnterior = pedidos.filter(p => {
            const d = new Date(p.criado);
            return d.getMonth() + 1 === mesAnterior && d.getFullYear() === anoAnterior;
        });

        const contasMes = contas.filter(c => {
            const d = new Date(c.vencimento); 
            return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual;
        });

        const faturamentoAtual = pedidosMes.reduce((acc, p) => acc + Number(p.valor_total), 0);
        const faturamentoAnterior = pedidosMesAnterior.reduce((acc, p) => acc + Number(p.valor_total), 0);

        const totalVendas = pedidosMes.length;

        let crescimento = 0;
        if (faturamentoAnterior > 0) {
            crescimento = ((faturamentoAtual - faturamentoAnterior) / faturamentoAnterior) * 100;
        } else if (faturamentoAtual > 0) {
            crescimento = 100;
        }
        const totalSaidas = contasMes.reduce((acc, c) => acc + Number(c.valor), 0);
        const lucroLiquido = faturamentoAtual - totalSaidas;

        const funcionariosAtivos = funcionarios.length;

        // Meta Mensal (Fictício ou fixo por enquanto, pois não temos tabela de metas)
        const metaMensal = 50000.00; // Exemplo fixo

        res.json({
            faturamento: faturamentoAtual,
            total_vendas: totalVendas,
            crescimento: crescimento.toFixed(1),
            funcionarios_ativos: funcionariosAtivos,
            meta_mensal: metaMensal,
            lucro_liquido: lucroLiquido
        });

    } catch (err) {
        console.error('Erro no Dashboard Filial:', err);
        res.status(500).json({ mensagem: 'Erro ao carregar dashboard' });
    }
};

export { obterResumoDashboard };