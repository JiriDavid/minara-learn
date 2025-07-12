"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(
  ({ className, src, alt = "", ...props }, ref) => {
    const [error, setError] = React.useState(false);

    if (error) {
      return null;
    }

    return (
      <div
        className={cn("aspect-square h-full w-full relative", className)}
        {...props}
      >
        <Image
          ref={ref}
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
