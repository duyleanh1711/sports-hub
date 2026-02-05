"use client";

import { ProgressBar } from "react-aria-components";
import { twMerge } from "tailwind-merge";

const Ring = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={twMerge("size-4", className)}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeOpacity="0.2"
      strokeWidth="1.6"
    />
    <path
      d="M12 3a9 9 0 0 1 9 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="origin-center animate-spin"
    />
  </svg>
);

const Spin = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={twMerge("size-4", className)}
    viewBox="0 0 2400 2400"
    aria-hidden="true"
    {...props}
  >
    <g strokeWidth="100" strokeLinecap="round" fill="none">
      <line x1="1200" y1="600" x2="1200" y2="100" />
      <line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800" />
      <line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4" />
      <line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6" />
      <line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650" />
      <line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500" />
      <line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200" />
      <line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200" />
      <line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750" />
      <line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900" />
      <line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6" />
      <line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 1200 1200;30 1200 1200;60 1200 1200;90 1200 1200;120 1200 1200;150 1200 1200;180 1200 1200;210 1200 1200;240 1200 1200;270 1200 1200;300 1200 1200;330 1200 1200"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
);

const LOADERS = {
  ring: Ring,
  spin: Spin,
};

const DEFAULT_SPINNER = "spin";

export interface LoaderProps
  extends Omit<
    React.ComponentPropsWithoutRef<"svg">,
    "display" | "opacity" | "intent"
  > {
  variant?: keyof typeof LOADERS;
  percentage?: number;
  isIndeterminate?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  ref?: React.RefObject<SVGSVGElement>;
  "data-slot"?: string;
}

export function Loader({ isIndeterminate = true, ref, ...props }: LoaderProps) {
  const { className, variant = DEFAULT_SPINNER, ...spinnerProps } = props;
  const LoaderPrimitive =
    LOADERS[variant in LOADERS ? variant : DEFAULT_SPINNER];

  return (
    <ProgressBar
      data-slot={props["data-slot"] ?? "loader"}
      aria-label={props["aria-label"] ?? "Pending..."}
      formatOptions={props.formatOptions}
      isIndeterminate={isIndeterminate}
    >
      <LoaderPrimitive
        role="presentation"
        ref={ref}
        {...spinnerProps}
        className={twMerge(
          "size-4",
          variant === "spin" && "stroke-current animate-spin",
          className,
        )}
      />
    </ProgressBar>
  );
}
