export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-purple-400">Kera</h1>
        <p className="text-lg text-gray-400 max-w-md">
          SaaS premium para estética automotiva — WhatsApp como vendedor 24h.
        </p>
        <a
          href="https://api.kera.stazak.com.br/health"
          target="_blank"
          className="inline-block rounded bg-purple-600 px-6 py-3 text-sm font-medium hover:bg-purple-700 transition"
        >
          API Health Check
        </a>
      </div>
    </main>
  );
}