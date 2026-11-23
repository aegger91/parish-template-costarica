import { createElement } from 'react';
import OrthodoxCross from './OrthodoxCross';
import iconData from './orthodoxIcons.json';

type IconNode = [string, Record<string, string | number>];

/*
  Orthodox pictograms drawn on the same 24px grid and stroke style as the
  lucide utility icons. Shapes live in orthodoxIcons.json; a "cross" entry
  places the shared OrthodoxCross, with "weight" as its stroke relative to the icon's.
*/
const ICONS = iconData as unknown as Record<string, IconNode[]>;

export type OrthodoxIconName = keyof typeof iconData;

export default function OrthodoxIcon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: OrthodoxIconName;
  className?: string;
  strokeWidth?: number | string;
}) {
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
      {ICONS[name].map(([tag, attrs], i) => {
        if (tag === 'cross') {
          const { weight, ...box } = attrs;
          return <OrthodoxCross key={i} {...box} strokeWidth={(sw * Number(weight)) / (Number(box.width) / 24)} />;
        }
        return createElement(tag, { key: i, ...attrs });
      })}
    </svg>
  );
}
