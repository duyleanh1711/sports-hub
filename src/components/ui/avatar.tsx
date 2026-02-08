import Image from "next/image";
import { twMerge } from "tailwind-merge";

export interface AvatarProps {
  src?: string | null;
  initials?: string;
  alt?: string;
  className?: string;
  isSquare?: boolean;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
}

export function Avatar({
  src = null,
  isSquare = false,
  size = "md",
  initials,
  alt = "",
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={twMerge(
        "relative inline-grid size-(--avatar-size) shrink-0 align-middle overflow-hidden",
        "outline-1 outline-fg/(--ring-opacity) -outline-offset-1",
        "[--avatar-radius:20%] [--ring-opacity:20%]",
        "*:col-start-1 *:row-start-1",
        size === "xs" && "[--avatar-size:--spacing(5)]",
        size === "sm" && "[--avatar-size:--spacing(6)]",
        size === "md" && "[--avatar-size:--spacing(8)]",
        size === "lg" && "[--avatar-size:--spacing(10)]",
        size === "xl" && "[--avatar-size:--spacing(12)]",
        size === "2xl" && "[--avatar-size:--spacing(14)]",
        size === "3xl" && "[--avatar-size:--spacing(16)]",
        size === "4xl" && "[--avatar-size:--spacing(20)]",
        size === "5xl" && "[--avatar-size:--spacing(24)]",
        size === "6xl" && "[--avatar-size:--spacing(28)]",
        size === "7xl" && "[--avatar-size:--spacing(32)]",
        size === "8xl" && "[--avatar-size:--spacing(36)]",
        size === "9xl" && "[--avatar-size:--spacing(42)]",
        isSquare ? "rounded-(--avatar-radius)" : "rounded-full",
        className,
      )}
    >
      {initials && !src && (
        // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
        <svg
          className={twMerge(
            "size-full select-none uppercase",
            "bg-primary text-white",
            "fill-current p-[12%]",
            "font-medium",
          )}
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : "true"}
        >
          {alt && <title>{alt}</title>}
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            dominantBaseline="middle"
            textAnchor="middle"
            dy=".125em"
            className="text-[52px]"
          >
            {initials}
          </text>
        </svg>
      )}

      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 48px, 96px"
          className="object-cover object-center"
          priority={size === "xl" || size === "2xl"}
        />
      )}
    </span>
  );
}
