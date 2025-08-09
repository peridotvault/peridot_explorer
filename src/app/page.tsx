export default function Home() {
  return (
    <main className="flex justify-center">
      <div className="p-4 fixed  top-0 left-0 w-full z-30">
        <header
          className={`transition-all duration-300 rounded-2xl flex justify-center border backdrop-blur-lg border-white/10 `}
        >
          <div className="w-full px-8 py-6 flex items-center justify-between">
            <a href="/#" className="text-2xl">
              <span className="font-bold">Peridot</span>
              <span>Vault</span>
            </a>
          </div>
        </header>
      </div>
      <div className="max-w-[1200px] w-full pt-28">
        <h1>PeridotVault</h1>
      </div>
    </main>
  );
}
