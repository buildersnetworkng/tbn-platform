const BAR_HEIGHTS = [28, 40, 34, 52, 46, 64, 58, 76];

export function GrowthVisual() {
  return (
    <div aria-hidden="true" className="flex h-20 items-end justify-center gap-2">
      {BAR_HEIGHTS.map((height, index) => (
        <div
          key={index}
          className="w-3 rounded-t-sm bg-accent/25"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}
