import type {Metadata} from 'next';
import { Newsreader, Manrope } from 'next/font/google';
import './globals.css'; // Global styles

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'risueño — Diario de Ánimo',
  description: 'Navega por tus recuerdos y emociones.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${newsreader.variable} ${manrope.variable}`}>
      <body className="bg-surface text-on-surface min-h-screen selection:bg-primary/30 font-body antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
