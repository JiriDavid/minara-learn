import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        primary:
          "bg-blue-600 text-white hover:bg-blue-600/80 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600/80",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/80 dark:bg-red-900 dark:text-white dark:hover:bg-red-900/80",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        success:
          "bg-green-500 text-white hover:bg-green-500/80 dark:bg-green-700 dark:text-white dark:hover:bg-green-700/80",
        warning:
          "bg-yellow-400 text-slate-900 hover:bg-yellow-400/80 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
