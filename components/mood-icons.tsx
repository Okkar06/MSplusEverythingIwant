// Custom mood icons (see DESIGN.md → Mood icons).
// 24×24 grid, 2px round strokes, coloured with currentColor so the mood colour
// is applied from outside: <MoodIcon mood="calm" className="size-12 text-mood-calm" />.
// Eyes are zero-length strokes, which round caps turn into dots.

import type { SVGProps } from "react";
import type { MoodValue } from "@/lib/moods";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      {children}
    </svg>
  );
}

const DOT_EYES = "M9 9.5h.01M15 9.5h.01";

export function HappyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d={DOT_EYES} />
      <path d="M8 14q4 4 8 0" />
    </Base>
  );
}

export function LovedIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 16.5C12 16.5 7.5 13.8 7.5 10.75A2.25 2.25 0 0 1 12 10A2.25 2.25 0 0 1 16.5 10.75C16.5 13.8 12 16.5 12 16.5Z" />
    </Base>
  );
}

export function CalmIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 10q1.5 1.5 3 0M13.5 10q1.5 1.5 3 0" />
      <path d="M9.5 15q2.5 1.5 5 0" />
    </Base>
  );
}

export function ExcitedIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 10.5l1.5-1.5 1.5 1.5M13.5 10.5l1.5-1.5 1.5 1.5" />
      <path d="M8 13.5h8a4 4 0 0 1-8 0Z" />
    </Base>
  );
}

export function TiredIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 10h3M13.5 10h3" />
      <path d="M10 15.5h4" />
    </Base>
  );
}

export function SadIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d={DOT_EYES} />
      <path d="M8.5 16q3.5-3 7 0" />
    </Base>
  );
}

export function StressedIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 8l3 1.5M16.5 8l-3 1.5" />
      <path d="M8 15.5l1.33-1 1.33 1 1.34-1 1.33 1 1.33-1 1.34 1" />
    </Base>
  );
}

export function MissingYouIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 9.5q1.5 1.5 3 0M13.5 9.5q1.5 1.5 3 0" />
      <path d="M12 17C12 17 9.5 15.6 9.5 14A1.25 1.25 0 0 1 12 13.6A1.25 1.25 0 0 1 14.5 14C14.5 15.6 12 17 12 17Z" />
    </Base>
  );
}

const ICONS: Record<MoodValue, (props: IconProps) => React.JSX.Element> = {
  happy: HappyIcon,
  loved: LovedIcon,
  calm: CalmIcon,
  excited: ExcitedIcon,
  tired: TiredIcon,
  sad: SadIcon,
  stressed: StressedIcon,
  missing_you: MissingYouIcon,
};

export function MoodIcon({ mood, ...props }: IconProps & { mood: MoodValue }) {
  const Icon = ICONS[mood];
  return <Icon {...props} />;
}
