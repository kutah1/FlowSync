interface Props {
  /** pixel size of the avatar */
  size?: number;
  className?: string;
}

/** MiniMe — the friendly companion avatar, used consistently across onboarding. */
export default function MiniMe({ size = 96, className = "" }: Props) {
  const eye = Math.max(4, Math.round(size * 0.07));
  const mouthW = Math.round(size * 0.28);
  const mouthH = Math.round(size * 0.14);

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand shadow-brand ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{ gap: size * 0.08 }}
      >
        <div className="flex" style={{ gap: size * 0.16 }}>
          <span
            className="rounded-full bg-white"
            style={{ width: eye, height: eye }}
          />
          <span
            className="rounded-full bg-white"
            style={{ width: eye, height: eye }}
          />
        </div>
        <div
          className="rounded-b-full border-white"
          style={{
            width: mouthW,
            height: mouthH,
            borderBottomWidth: Math.max(2, Math.round(size * 0.03)),
          }}
        />
      </div>
    </div>
  );
}
