"use client"
import FinanceiroEntradas from "@/components/FinanceiroAdmin/FinanceiroEntradas/FinanceiroEntradas";
import FinanceiroSaida from "@/components/FinanceiroAdmin/FinanceiroSaída/FinanceiroSaida";
import FinanceiroFornecedor from "@/components/FinanceiroFornecedor/FinanceiroFornecedor";
import FinanceiroFuncionarios from "@/components/FinanceiroAdmin/FinanceiroFuncionario/FinanceiroFuncionarios";
import FinanceiroFluxoCaixa from "@/components/FinanceiroAdmin/FinanceiroFluxoCaixa/FinanceiroFluxoCaixa"
import "./ModuleFinanceiroAdm.css";

export default function Financeiro() {
 
  return (
    <>
<div className="FinanceiroInicial">
<FinanceiroEntradas/>
 </div>
 


<div className="FinanceiroDivisao">
  <FinanceiroSaida/>
</div>

<div className="FinanceiroDivisao">
<FinanceiroFornecedor/>
</div>

<div className="FinanceiroDivisao">
<FinanceiroFuncionarios/>
</div>
  

    </>
  );
}