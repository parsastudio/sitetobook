"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction } from "@/app/actions/admin.actions";
import { ShieldCheckIcon, LockIcon } from "@/components/ui/icons";

export function AdminLoginView() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginAdminAction(password);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error);
        setPassword("");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-border-default bg-surface p-6 sm:p-8 shadow-lg flex flex-col gap-5 text-left">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-text-inverse shadow-xs">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-text-primary">
            Master Shield
          </h1>
          <p className="text-xs text-text-muted">
            Platform administrative control gateway
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive-subtle p-2.5 text-xs font-semibold text-destructive text-center">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-text-secondary">
              Master Access Key
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm font-mono font-semibold text-text-primary outline-hidden focus:border-border-focus focus:bg-surface"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-xs text-text-muted hover:text-text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-black uppercase tracking-wider text-text-inverse shadow-xs transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50"
          >
            <LockIcon className="h-3.5 w-3.5" />
            <span>{isPending ? "Authenticating..." : "Unlock Platform"}</span>
          </button>
        </form>

        <div className="rounded-lg border border-border-subtle bg-subtle p-2.5 text-center text-[11px] text-text-muted">
          Default Master Key: <strong className="font-mono text-text-primary">AdminPristine2026!</strong>
        </div>
      </div>
    </div>
  );
}
