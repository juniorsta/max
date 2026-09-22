import './globals.css';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Kera</title>
        <meta name="description" content="SaaS para estética automotiva" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-gray-950 text-white min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}