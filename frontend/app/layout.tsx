import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Kera</title>
        <meta name="description" content="SaaS para estética automotiva" />
      </head>
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}