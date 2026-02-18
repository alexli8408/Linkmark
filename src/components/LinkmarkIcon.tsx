interface LinkmarkIconProps {
  size?: number;
  className?: string;
}

export default function LinkmarkIcon({ size = 24, className }: LinkmarkIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <rect width="32" height="32" rx="8" fill="#18181b" />
      <path
        d="M9 6h14a1 1 0 0 1 1 1v20.2a0.8 0.8 0 0 1-1.2.7L16 24l-6.8 3.9A0.8 0.8 0 0 1 8 27.2V7a1 1 0 0 1 1-1z"
        fill="#fafafa"
      />
    </svg>
  );
}
