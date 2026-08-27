const TONE_CLASSES = {
  cognac: "bg-cognac text-bone/80",
  siena: "bg-siena text-bone/80",
  stone: "bg-stone text-cocoaBark/70",
  cocoaBark: "bg-cocoaBark text-bone/70",
  espresso: "bg-espresso text-bone/70",
} as const;

type Tone = keyof typeof TONE_CLASSES;

/**
 * Solid-color stand-in for real photography, per the Brand Guide's photo
 * direction: never generic real-estate stock while assets are pending.
 * Swap for a real <Image> once /public/images/ has the client's files.
 */
export default function PhotoPlaceholder({
  label,
  tone = "cognac",
  className = "",
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${TONE_CLASSES[tone]} ${className}`}
      aria-hidden="true"
    >
      <span className="max-w-[16rem] px-6 text-center font-mono text-[10px] uppercase tracking-caption">
        {label}
      </span>
    </div>
  );
}
