export function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {/* Ambient gradient & tech grid canvas */}
      <div className="absolute inset-0 bg-ambient-grid" />

      {/* Subtle top ambient hairline glow */}
      <div className="absolute top-0 left-1/2 h-[1px] w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
    </div>
  )
}
