export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="text-slate-400">Sunday, April 5, 2026</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <section className="panel">
          <h3 className="panel-title">Active Matters</h3>
          <div className="card mt-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Sovereign State</p>
            <p className="text-xl font-mono">0</p>
          </div>
        </section>

        <section className="panel">
          <h3 className="panel-title">Review Queue</h3>
          <div className="card mt-2">
            <span className="badge badge--pending">0 Items</span>
          </div>
        </section>
      </div>
    </div>
  );
}