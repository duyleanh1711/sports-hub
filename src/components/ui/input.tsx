"use client";

import * as React from "react";
import {
  Input as InputPrimitive,
  type InputProps as PrimitiveInputProps,
} from "react-aria-components";
import { cx } from "@/lib/primitive";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const Input = React.forwardRef<HTMLInputElement, PrimitiveInputProps>(
  ({ className, type, ...props }, ref) => {
    const isPassword = type === "password";
    const [visible, setVisible] = React.useState(false);

    return (
      <span data-slot="control" className="relative block w-full">
        <InputPrimitive
          ref={ref}
          type={isPassword && visible ? "text" : type}
          className={cx(
            "relative block w-full appearance-none rounded-lg",
            "px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)]",
            "sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
            "text-base/6 text-fg placeholder:text-muted-fg sm:text-sm/6",
            "border border-input enabled:hover:border-muted-fg/30",
            "outline-hidden focus:border-ring/70 focus:ring-3 focus:ring-ring/20",
            "invalid:border-danger-subtle-fg/70",
            "disabled:bg-muted",
            "dark:scheme-dark",
            isPassword && "pe-10",
            className,
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg hover:text-fg cursor-pointer"
          >
            {visible ? (
              <EyeIcon className="size-4" />
            ) : (
              <EyeSlashIcon className="size-4" />
            )}
          </button>
        )}
      </span>
    );
  },
);

Input.displayName = "Input";
