export function TenantHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Instant Upfront Price",
      description: "Select your bedroom count and desired cleaning tier. Zero surprise charges or awkward in-home walkthroughs.",
      badge: "60-Second Quote",
    },
    {
      number: "02",
      title: "Confirm in 1 Tap",
      description: "Your estimate loads instantly into your text messages (SMS). Lock your preferred arrival slot directly with our dispatcher.",
      badge: "Zero Deposit Required",
    },
    {
      number: "03",
      title: "Hotel-Standard Clean",
      description: "Our vetted, background-checked staff arrives fully equipped with eco-grade supplies and completes our 40-point checklist.",
      badge: "24h Reclean Guarantee",
    },
  ];

  return (
    <section className="w-full bg-surface py-16 px-4 sm:px-6 border-b border-border-default">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-10">
        <div className="flex flex-col items-center text-center gap-2 max-w-xl">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">
            Frictionless Protocol
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-text-primary">
            How White-Glove Service <span className="font-serif italic text-primary">Operates</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            From instant online calculation to a spotless sanctuary in three stress-free steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col justify-between rounded-2xl border border-border-default bg-canvas p-6 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
            >
              <div className="flex flex-col gap-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl sm:text-4xl font-normal italic text-primary/30">
                    {step.number}
                  </span>
                  <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
