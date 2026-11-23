import OrthodoxCross from './OrthodoxCross';

/** The lucide "church" outline with its Latin cross swapped for the Orthodox cross. */
export default function ChurchIcon({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number | string }) {
  const sw = Number(strokeWidth);
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M14 22v-4a2 2 0 0 0-4 0v4" />
      <path d="M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22" />
      <path d="m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7" />
      <OrthodoxCross x={8.25} y={4.4} width={7.5} height={10} strokeWidth={(sw * 0.6) / 0.3125} />
    </svg>
  );
}
