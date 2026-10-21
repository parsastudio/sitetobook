export default function TenantLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-9 w-full bg-subtle border-b border-border-default" />

      {/* Header Skeleton */}
      <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="h-8 w-44 rounded-lg bg-subtle" />
        <div className="h-9 w-32 rounded-xl bg-subtle" />
      </div>

      {/* Visual Split Hero Skeleton */}
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="h-6 w-56 rounded-full bg-subtle" />
          <div className="h-16 w-full rounded-2xl bg-subtle" />
          <div className="h-10 w-3/4 rounded-xl bg-subtle" />
          <div className="flex gap-4">
            <div className="h-12 w-48 rounded-2xl bg-subtle" />
            <div className="h-12 w-36 rounded-2xl bg-subtle" />
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center">
          <div className="h-[420px] sm:h-[500px] w-full max-w-md rounded-3xl bg-subtle border border-border-default" />
        </div>
      </div>

      {/* Trust Badges Strip Skeleton */}
      <div className="mt-8 border-y border-border-default bg-surface py-8">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-12 rounded-xl bg-subtle" />
          <div className="h-12 rounded-xl bg-subtle" />
          <div className="h-12 rounded-xl bg-subtle" />
          <div className="h-12 rounded-xl bg-subtle" />
        </div>
      </div>
    </div>
  );
}
