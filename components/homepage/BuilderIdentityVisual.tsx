const GRID_SIZE = 24;
const LIT_INDICES = new Set([1, 3, 8, 9, 14, 17, 20]);

export function BuilderIdentityVisual() {
  return (
    <div
      aria-hidden="true"
      className="grid w-full max-w-[320px] grid-cols-6 gap-2 tablet:max-w-[380px]"
    >
      {Array.from({ length: GRID_SIZE }).map((_, index) => (
        <div
          key={index}
          className={`identity-cell aspect-square rounded-md ${
            LIT_INDICES.has(index) ? 'bg-accent/70' : 'bg-white/[0.08]'
          }`}
          style={{
            animationDelay: `${(index % 12) * 0.35}s`,
            ['--cell-base-opacity' as string]: LIT_INDICES.has(index) ? 0.55 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
