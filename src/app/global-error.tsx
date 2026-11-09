"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center font-sans text-zinc-100">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl flex flex-col items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 font-bold text-2xl">
            !
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              System Critical Interruption
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A root-level runtime anomaly occurred. The platform has automatically isolated the process.
            </p>
            {error.digest && (
              <span className="font-mono text-[10px] text-zinc-500">
                Incident Ref: {error.digest}
              </span>
            )}
          </div>

          <button
            onClick={() => reset()}
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#0a3326] px-5 py-3 text-xs font-bold text-white transition-all hover:bg-[#115e45]"
          >
            Attempt Platform Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
