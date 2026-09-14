export function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M15.5 8.5 13 13l-4.5 2.5L11 11l4.5-2.5Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
