import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-slate-100 dark:bg-slate-800 w-full", className)}
      {...props} />)
  );
}

export { Skeleton }
