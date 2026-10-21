import Link from "next/link";

export default function TenantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-surface p-8 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive-subtle text-destructive font-bold text-xl">
          !
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
          Cleaner Not Found
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          The residential cleaning portal you are looking for does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover active:bg-primary-active"
          >
            Explore Verified Cleaners →
          </Link>
        </div>
      </div>
    </div>
  );
}
