"use client";

import { Loader } from "@/components/ui/loader";

type FullScreenLoaderProps = {
  variant?: "ring" | "spin";
  className?: string;
  offsetTop?: number;
};

export function FullScreenLoader({
  variant = "ring",
  className,
  offsetTop = 0,
}: FullScreenLoaderProps) {
  return (
    <div
      className="flex items-center justify-center bg-background"
      style={{
        minHeight: `calc(100vh - ${offsetTop}px)`,
      }}
    >
      <Loader
        variant={variant}
        className={className ?? "size-9 text-primary"}
      />
    </div>
  );
}
