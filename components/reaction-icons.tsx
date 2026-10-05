// Reaction icons, drawn like the mood icons (see DESIGN.md → Mood icons):
// 24×24 grid, 2px round strokes, currentColor. Unlike moods they have no
// enclosing circle, so a reaction never reads as a mood.

import type { SVGProps } from "react";
import type { ReactionKind } from "@/lib/reactions";

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
      {children}
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </Base>
  );
}

// Two arms wrapping around a small heart.
export function HugIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 15s-3-1.8-3-4a1.7 1.7 0 0 1 3-1.1A1.7 1.7 0 0 1 15 11c0 2.2-3 4-3 4z" />
      <path d="M4 8c-1.5 4.5 1 9 5.5 11" />
      <path d="M20 8c1.5 4.5-1 9-5.5 11" />
    </Base>
  );
}

// A thought bubble: a cloud with two trailing dots.
export function ThinkingOfYouIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 15a3.5 3.5 0 0 1-.5-7A4.5 4.5 0 0 1 15 6.5a3.5 3.5 0 0 1 2 7 2.5 2.5 0 0 1-3 1.5H7z" />
      <path d="M8 18.5h.01M5.5 21h.01" />
    </Base>
  );
}

const ICONS: Record<ReactionKind, (props: IconProps) => React.JSX.Element> = {
  heart: HeartIcon,
  hug: HugIcon,
  thinking_of_you: ThinkingOfYouIcon,
};

export function ReactionIcon({ kind, ...props }: IconProps & { kind: ReactionKind }) {
  const Icon = ICONS[kind];
  return <Icon {...props} />;
}
