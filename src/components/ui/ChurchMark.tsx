import type { SVGProps } from 'react';

/*
  Fine line drawing of a Russian church on a 128 x 100 grid: a bell tower, a refectory, the main
  church with zakomara arches and an onion dome on its drum, and an apse. Every cross is the
  three-bar Orthodox cross with the slanted footrest higher on the viewer's left.
*/
const CHURCH_PATHS = [
  'M4 94H124',
  'M12 94V58H30V94',
  'M10.5 58H31.5',
  'M14.5 58V45H27.5V58',
  'M18.5 56V51.5a2.5 2.5 0 0 1 5 0V56',
  'M13 45H29',
  'M17.5 45V38H24.5V45',
  'M18.4 38C15 36.9 14.1 33 16.8 30.5C18.8 28.7 20.5 27.4 21 24.5C21.5 27.4 23.2 28.7 25.2 30.5C27.9 33 27 36.9 23.6 38Z',
  'M21 24.5V10.5M19.4 12.6H22.6M18 15.4H24M19.3 19.4L22.7 21',
  'M18.5 94V87a2.5 2.5 0 0 1 5 0V94',
  'M30 70L33 66H52',
  'M36 84V79a2 2 0 0 1 4 0V84M44 84V79a2 2 0 0 1 4 0V84',
  'M52 94V56M92 56V94',
  'M51 56Q58 48.5 65.3 56Q72 48.5 78.7 56Q86 48.5 93 56',
  'M51 62H93',
  'M65 52.6V41H79V52.6',
  'M72 49V44.5',
  'M66.6 41C60.8 39.2 59.4 32.8 64.2 28.6C67.6 25.8 71.2 23.8 72 19.5C72.8 23.8 76.4 25.8 79.8 28.6C84.6 32.8 83.2 39.2 77.4 41Z',
  'M72 19.5V3.5M70 6H74M67.8 9.4H76.2M69.6 14L74.4 16.2',
  'M57.5 78V70a2.5 2.5 0 0 1 5 0V78M81.5 78V70a2.5 2.5 0 0 1 5 0V78',
  'M67.5 94V84.5a4.5 4.5 0 0 1 9 0V94',
  'M92 70Q100 63 108 70V94',
  'M98.5 84V79a1.5 1.5 0 0 1 3 0V84',
];

export default function ChurchMark({ strokeWidth = 1.7, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 128 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {CHURCH_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
