import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Clarion Nexus - AI-Powered Premium Digital Agency Platform',
  description: 'Clarion Nexus is a state-of-the-art digital agency delivering enterprise-grade Web Development, UI/UX systems, search engine rankings (SEO), and custom Agentic AI workflows.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Clarion Nexus - Digital Agency & AI Platform',
    description: 'Enterprise-grade Web Development, UI/UX design, SEO, and Agentic AI integrations.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-app-bg text-app-fg" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <ChatWidget />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
