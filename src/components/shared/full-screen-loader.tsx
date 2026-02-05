"use client";

import { Loader } from "@/components/ui/loader";

type FullScreenLoaderProps = {
  variant?: "ring" | "spin";
  className?: string;
};

export function FullScreenLoader({
  variant = "ring",
  className,
}: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader
        variant={variant}
        className={className ?? "size-9 text-primary"}
      />
    </div>
  );
}
