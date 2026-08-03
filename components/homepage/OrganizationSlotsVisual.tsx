const SLOT_COUNT = 8;
const HIGHLIGHTED_INDEX = 3;

export function OrganizationSlotsVisual() {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-[420px] items-center justify-center gap-3">
      {Array.from({ length: SLOT_COUNT }).map((_, index) => (
        <div key={index} className={`h-10 flex-1 rounded-md border transition-colors duration-500 ${index === HIGHLIGHTED_INDEX ? 'border-accent/40 bg-accent/10' : 'border-border bg-white/[0.03]'}`} />
      ))}
    </div>
  );
}
