export function TenantTrustStrip() {
  const guarantees = [
    {
      title: "Commercial Coverage",
      caption: "Active policy through Hiscox",
      icon: "🛡️",
    },
    {
      title: "Strict Background Check",
      caption: "Nationwide screening clearance",
      icon: "🔍",
    },
    {
      title: "Clean Equipment Guarantee",
      caption: "Fresh sanitized microfibers per home",
      icon: "✨",
    },
    {
      title: "Zero Hidden Surcharges",
      caption: "Supplies & tax included in quote",
      icon: "🏷️",
    },
  ];

  return (
    <section className="w-full border-y border-border-default bg-surface py-6 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
        {guarantees.map((g) => (
          <div key={g.title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-base font-bold shadow-xs">
              {g.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-text-primary">{g.title}</span>
              <span className="text-[11px] text-text-muted">{g.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
