interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false as const,
});

export function ArrowUpRight({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}

export function ArrowRight({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M20 12H4M10 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronDown({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Close({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function Plus({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Minus({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function Compass({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

export function Sun({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function Sunset({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M2 18h20M5 18a7 7 0 0 1 14 0M12 3v5M5.6 9.6 7 11M18.4 9.6 17 11M3 14h2M19 14h2" />
    </svg>
  );
}

export function Moon({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  );
}

export function Layers({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" />
    </svg>
  );
}

export function Cube({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7l9-4.5Z" />
      <path d="M3 7l9 4.5L21 7M12 11.5v10" />
    </svg>
  );
}

export function Rotate({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M3 10V4m0 6h6M3.5 10a9 9 0 1 1 2.2 9.3" />
    </svg>
  );
}

export function Mail({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function Phone({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M7 3h3l1.5 5-2 1.5a12 12 0 0 0 5 5L16 12.5l5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 5 5.2 2 2 0 0 1 7 3Z" />
    </svg>
  );
}

export function MapPin({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Check({ size = 16, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="m4 12.5 5 5L20 6" />
    </svg>
  );
}

export function Send({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5 21 3Z" />
    </svg>
  );
}

export function Sparkle({ size = 16, className, strokeWidth = 1.2 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M12 2.5c.8 5 3.5 7.7 8.5 8.5-5 .8-7.7 3.5-8.5 8.5-.8-5-3.5-7.7-8.5-8.5 5-.8 7.7-3.5 8.5-8.5Z" />
      <path d="M19 16.5c.3 1.7 1.3 2.7 3 3-1.7.3-2.7 1.3-3 3-.3-1.7-1.3-2.7-3-3 1.7-.3 2.7-1.3 3-3Z" opacity=".6" />
    </svg>
  );
}

export function Info({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function Expand({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M9 3H3v6M15 21h6v-6M3 3l6 6M21 21l-6-6" />
    </svg>
  );
}

export function Lock({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function Pause({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M9 5v14M15 5v14" />
    </svg>
  );
}

export function Play({ size = 16, className, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={strokeWidth}>
      <path d="M7 4.5 19 12 7 19.5v-15Z" />
    </svg>
  );
}
