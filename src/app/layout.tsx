import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OAuth Setup Navigator | Interactive Guide for Builders & AI Agents',
  description: 'Understand OAuth complexity, developer effort vs provider approval wait times, and step-by-step agent automations across 100+ platforms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
