import { cn } from "tailwind-variants";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("max-w-337.5 mx-auto px-4", className)}>{children}</div>
  );
}
