"use client";

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-3xl border border-border-default bg-surface p-8 shadow-lg flex flex-col items-center gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive-subtle text-destructive font-black text-xl">
          ✕
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-text-primary">
            Application Service Notice
          </h2>
          <p className="text-xs text-text-secondary">
            An unexpected error interrupted this view. Our edge resilience systems are standing by.
          </p>
          {error.digest && (
            <span className="font-mono text-[10px] text-text-muted">
              Reference: {error.digest}
            </span>
          )}
        </div>

        <button
          onClick={() => reset()}
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-text-inverse transition-colors hover:bg-primary-hover"
        >
          Reload Interface ↻
        </button>
      </div>
    </div>
  );
}
