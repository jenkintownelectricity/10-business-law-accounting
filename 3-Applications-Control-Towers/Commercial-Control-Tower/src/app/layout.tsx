import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Commercial Control Tower',
  description: 'Sovereign truth workstation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="workspace-shell">
        {/* Left Orchestration Spine */}
        <aside className="workspace-sidebar">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">C</div>
              <h1 className="text-lg font-bold tracking-tight">CCT</h1>
            </div>
            <nav className="flex flex-col gap-1">
              <a href="/matters" className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-slate-800 transition-all">
                <span className="opacity-50">#</span> Matters
              </a>
              <a href="/contracts" className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-slate-800 transition-all">
                <span className="opacity-50">#</span> Contracts
              </a>
              <a href="/accounting" className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-slate-800 transition-all">
                <span className="opacity-50">#</span> Accounting
              </a>
            </nav>
          </div>
        </aside>

        {/* Top Intelligence Bar */}
        <header className="workspace-topbar">
          <div className="voice-indicator voice-indicator--active">Iron Ear Active</div>
        </header>

        {/* Central Contextual Stage */}
        <main className="workspace-main">
          {children} {/* THIS IS WHERE PAGE.TSX INJECTS ITS CONTENT */}
        </main>
      </body>
    </html>
  );
}