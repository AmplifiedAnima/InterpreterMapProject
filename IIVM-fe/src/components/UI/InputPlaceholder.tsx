import * as React from "react";
import { cn } from "../../utils/misx";

const InputPlaceholder = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        " flex w-full rounded-md border-input bg-background border-[#b9bbe8] border-[2px] px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
InputPlaceholder.displayName = "Input";

export { InputPlaceholder as Input };
