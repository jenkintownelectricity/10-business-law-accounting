import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Commercial Control Tower — Business Law Accounting',
  description: 'Sovereign domain operating system for business, law, and accounting practitioners',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="cct-body">
        <div className="cct-app">
          {children}
        </div>
      </body>
    </html>
  );
}
