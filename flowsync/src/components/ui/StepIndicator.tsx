/** Onboarding progress dots (Nielsen: visibility of system status). */
export default function StepIndicator({
  total,
  current,
}: {
  total: number;
  current: number; // 1-based
}) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i + 1 === current;
        return (
          <span
            key={i}
            className={
              active
                ? "h-1.5 w-6 rounded-full bg-brand transition-all"
                : "h-1.5 w-1.5 rounded-full bg-neutral-300 transition-all"
            }
          />
        );
      })}
    </div>
  );
}
