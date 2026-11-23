import type { SVGProps } from 'react';

/*
  Eight-pointed Orthodox cross on a 24 x 32 grid: short top bar, long crossbar,
  and a slanted footrest whose left end (viewer's left) is higher.
  public/favicon.svg uses the same path; keep them in sync.
*/
const PATH = 'M12 2v28M8.5 7h7M4 13h16M7.5 21l9 4';

export default function OrthodoxCross({ strokeWidth = 2.5, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d={PATH} />
    </svg>
  );
}
