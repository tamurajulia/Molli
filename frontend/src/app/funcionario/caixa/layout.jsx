import Protecao from '@/components/403/page';

export default function PDVLayout({ children }) {
  return (
    <Protecao allow={4}>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        {children}
      </div>
    </Protecao>
  );
}
