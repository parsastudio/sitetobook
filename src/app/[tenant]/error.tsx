"use client";

interface TenantErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TenantError({ reset }: TenantErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-surface p-8 shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive-subtle text-destructive font-bold">
          ✕
        </div>
        <h2 className="mt-4 text-xl font-bold text-text-primary">
          Unable to Load Service Portal
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          An unexpected network issue occurred while loading this cleaner&apos;s rates.
        </p>
        <button
          onClick={() => reset()}
          type="button"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
