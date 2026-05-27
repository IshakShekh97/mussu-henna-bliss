import { clsx } from "clsx";
import { Flower } from "lucide-react";

interface TulipSepratorProps {
  sepratorColor?: string;
  tulipColor?: string;
  variant?: "straight" | "wavy";
  className?: string;
}

const WavySeparator = ({ color }: { color: string }) => {
  return (
    <svg
      className="flex-1 h-6"
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,12 Q 25,4 50,12 T 100,12"
        stroke={color}
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const TulipSeprator = ({
  sepratorColor,
  tulipColor,
  variant = "straight",
  className,
}: TulipSepratorProps) => {
  const color = sepratorColor ? sepratorColor : "var(--color-accent)";
  const accentClass = sepratorColor ? "" : "bg-accent";

  return (
    <div
      className={clsx("flex items-center justify-center gap-3 py-4", className)}
    >
      {variant === "wavy" ? (
        <WavySeparator color={color} />
      ) : (
        <span className={clsx("h-px flex-1", accentClass)} />
      )}
      <Flower
        className={clsx("h-6 w-6", tulipColor ? tulipColor : "text-red-600")}
        aria-hidden="true"
      />
      {variant === "wavy" ? (
        <WavySeparator color={color} />
      ) : (
        <span className={clsx("h-px flex-1", accentClass)} />
      )}
    </div>
  );
};

export default TulipSeprator;
