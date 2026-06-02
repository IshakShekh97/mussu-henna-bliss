interface GoldShimmerProps {
  className?: string;
}

const GoldShimmer = ({ className }: GoldShimmerProps) => {
  return (
    <div
      className={`gold-shimmer rounded-md ${className || ""}`}
      aria-hidden="true"
    />
  );
};

export default GoldShimmer;
