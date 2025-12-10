import Protecao from '@/components/403/page';

export default function FuncionarioLayout({ children }) {
  return <Protecao allow={3}>{children}</Protecao>;
}
