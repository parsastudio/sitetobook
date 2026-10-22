import { ShieldCheckIcon, SearchCheckIcon, SparkleIcon, TagIcon } from "@/components/ui/icons";

export function TenantTrustStrip() {
  const guarantees = [
    {
      title: "Commercial Coverage",
      caption: "Active policy through Hiscox",
      Icon: ShieldCheckIcon,
    },
    {
      title: "Strict Background Check",
      caption: "Nationwide screening clearance",
      Icon: SearchCheckIcon,
    },
    {
      title: "Clean Equipment Guarantee",
      caption: "Fresh sanitized microfibers per home",
      Icon: SparkleIcon,
    },
    {
      title: "Zero Hidden Surcharges",
      caption: "Supplies & tax included in quote",
      Icon: TagIcon,
    },
  ];

  return (
    <section className="w-full border-y border-border-default bg-surface py-7 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
        {guarantees.map(({ title, caption, Icon }) => (
          <div key={title} className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-default bg-subtle text-primary shadow-xs">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-primary">{title}</span>
              <span className="text-[11px] text-text-muted mt-0.5">{caption}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
