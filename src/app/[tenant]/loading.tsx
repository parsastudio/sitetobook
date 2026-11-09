export default function TenantLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas animate-pulse">
      <div className="relative w-full min-h-screen flex items-center justify-center bg-slate-900 px-3.5 pt-16 pb-20 sm:px-6">
        <div className="w-full max-w-3xl rounded-2xl sm:rounded-4xl border border-white/20 bg-surface/95 p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col items-center gap-6">
          <div className="h-10 sm:h-16 w-4/5 rounded-2xl bg-subtle" />
          <div className="h-5 sm:h-6 w-2/3 rounded-xl bg-subtle" />
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto justify-center pt-2">
            <div className="h-12 sm:h-14 w-full sm:w-64 rounded-2xl bg-subtle" />
            <div className="h-12 sm:h-14 w-full sm:w-40 rounded-2xl bg-subtle" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-default w-full max-w-xl">
            <div className="h-16 rounded-2xl bg-subtle" />
            <div className="h-16 rounded-2xl bg-subtle" />
            <div className="h-16 rounded-2xl bg-subtle" />
          </div>
        </div>
      </div>

      <div className="w-full border-y border-border-default bg-surface py-7 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-12 rounded-xl bg-subtle" />
          <div className="h-12 rounded-xl bg-subtle" />
          <div className="h-12 rounded-xl bg-subtle" />
          <div className="h-12 rounded-xl bg-subtle" />
        </div>
      </div>
    </div>
  );
}
