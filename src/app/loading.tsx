export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brut-bg">
      <div className="border-4 border-black bg-brut-paper p-8 shadow-brut-xl text-center">
        <div className="mb-4 font-display text-3xl text-black">
          H<span className="text-brut-pink">.</span>MP
        </div>
        <div className="h-6 w-48 border-4 border-black bg-brut-paper p-0.5">
          <div
            className="h-full bg-brut-pink"
            style={{
              animation: 'loading-pulse 1.2s ease-in-out infinite',
              width: '60%',
            }}
          />
        </div>
        <p className="mt-3 font-mono text-[10px] font-bold tracking-widest text-black uppercase">
          Loading...
        </p>
        <style>{`
          @keyframes loading-pulse {
            0%, 100% { width: 20%; }
            50% { width: 80%; }
          }
        `}</style>
      </div>
    </div>
  );
}
