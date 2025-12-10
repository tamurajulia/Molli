'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Wallet, QrCode, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PagamentoDialog({
  open,
  onOpenChange,
  subtotal,
  onSuccess,
}) {
  const [etapa, setEtapa] = useState(1);
  const [metodo, setMetodo] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [numero, setNumero] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [erroCampos, setErroCampos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const pagar = () => {
    if (metodo === 'crédito' && etapa === 1) {
      setEtapa(2);
    } else {
      onOpenChange(false);
      toast.success('Compra realizada com sucesso!', {
        description: `Pagamento via ${metodo || 'pix'}`,
      });

      if (onSuccess) {
        onSuccess(metodo, parcelas);
      }

      setEtapa(1);
      setMetodo('');
      setParcelas('');
      setNumero('');
      setValidade('');
      setCvv('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-124 h-90 rounded-2xl flex flex-col justify-between">
        <DialogTitle className="sr-only">Pagamento</DialogTitle>
        {etapa === 1 && (
          <>
            <DialogTitle className="text-[#90A89A] text-center font-bold text-2xl mb-4">
              Método de pagamento
            </DialogTitle>
            <div className="flex justify-center gap-3 mb-4">
              {[
                { icon: <CreditCard />, label: 'crédito' },
                { icon: <Wallet />, label: 'débito' },
                { icon: <QrCode />, label: 'pix' },
              ].map((m) => (
                <Button
                  key={m.label}
                  variant={metodo === m.label ? 'default' : 'outline'}
                  onClick={() => setMetodo(m.label)}
                  className={`border-[#90A89A] text-[#90A89A] cursor-pointer hover:text-[#90A89A] ${
                    metodo === m.label && 'bg-[#90A89A] text-white'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </Button>
              ))}
            </div>

            {(metodo === 'crédito' || metodo === 'débito') && (
              <div className="space-y-3 mb-4">
                <Input
                  placeholder="Número do cartão"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className={`border ${
                    erroCampos && !numero
                      ? 'border-red-400'
                      : 'border-[#90A89A]'
                  }`}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Validade (MM/AA)"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    className={`border ${
                      erroCampos && !validade
                        ? 'border-red-400'
                        : 'border-[#90A89A]'
                    }`}
                  />
                  <Input
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className={`border ${
                      erroCampos && !cvv ? 'border-red-400' : 'border-[#90A89A]'
                    }`}
                  />
                </div>
              </div>
            )}

            <Button
              disabled={!metodo}
              className="w-full bg-[#90A89A] text-white hover:bg-[#A9BDB0]"
              onClick={() => {
                if (
                  (metodo === 'crédito' || metodo === 'débito') &&
                  (!numero || !validade || !cvv)
                ) {
                  setErroCampos(true);
                  toast.error('Preencha todos os campos do cartão.');
                  return;
                }
                setErroCampos(false);
                setEtapa(2);
                if (metodo === 'pix') {
                  setCarregando(true);
                  setTimeout(() => setCarregando(false), 2000);
                }
              }}
            >
              Próximo <ArrowRight className="ml-2 mt-auto" />
            </Button>
          </>
        )}

        {etapa === 2 && (
          <>
            <Button
              variant="ghost"
              className="absolute top-3 left-3 text-[#90A89A]"
              onClick={() => setEtapa(1)}
            >
              <ArrowRight className="rotate-180" />
            </Button>

            {metodo === 'pix' && (
              <>
                <DialogTitle className="text-[#90A89A] font-semibold text-center mb-4">
                  Pagamento via PIX
                </DialogTitle>
                {carregando ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-12 h-12 border-4 border-[#90A89A]/30 border-t-[#90A89A] rounded-full animate-spin"></div>
                    <p className="text-[#90A89A] mt-4">Gerando QR Code...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=Pagamento%20de%20R$${subtotal.toFixed(
                          2
                        )}&size=180x180`}
                        alt="QR Code PIX"
                        className="rounded-lg border border-[#90A89A]"
                      />
                    </div>
                    <Button
                      className="w-full bg-[#90A89A] text-white hover:bg-[#A9BDB0]"
                      onClick={pagar}
                    >
                      Confirmar pagamento <Check className="ml-2" />
                    </Button>
                  </>
                )}
              </>
            )}

            {metodo === 'débito' && (
              <>
                <DialogTitle className="text-[#90A89A] text-center font-semibold mb-4">
                  Confirmar pagamento no débito
                </DialogTitle>
                <p className="text-center text-[#90A89A] mb-4">
                  Valor total: <strong>R${subtotal.toFixed(2)}</strong>
                </p>
                <Button
                  className="w-full bg-[#90A89A] text-white hover:bg-[#A9BDB0]"
                  onClick={pagar}
                >
                  Finalizar compra <Check className="ml-2" />
                </Button>
              </>
            )}

            {metodo === 'crédito' && (
              <>
                <DialogTitle className="text-[#90A89A] font-bold text-center mb-4">
                  Parcelamento
                </DialogTitle>
                <div className="space-y-2 mb-4">
                  {Array.from({ length: 3 }, (_, i) => i + 1).map((n) => {
                    const valorParcela = subtotal / n;
                    return (
                      <label
                        key={n}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="parcelas"
                          checked={
                            parcelas ===
                            `${n}x de ${valorParcela.toFixed(2)}/mês`
                          }
                          onChange={() =>
                            setParcelas(
                              `${n}x de ${valorParcela.toFixed(2)}/mês`
                            )
                          }
                          className="accent-[#90A89A] w-4 h-4"
                        />
                        <span className="text-[#90A89A]">
                          {n}x de R${valorParcela.toFixed(2)} sem juros
                        </span>
                      </label>
                    );
                  })}
                </div>
                <Button
                  className="w-full bg-[#90A89A] text-white hover:bg-[#A9BDB0]"
                  onClick={pagar}
                >
                  Finalizar compra <Check className="ml-2" />
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}