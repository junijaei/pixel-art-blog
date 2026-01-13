import { cn } from "@/lib/utils"

export function DotDecoration({
  className,
  variant = "horizontal",
}: {
  className?: string
  variant?: "horizontal" | "vertical" | "corner" | "grid"
}) {
  if (variant === "horizontal") {
    return (
      <div className={cn("flex gap-1.5 items-center", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn("w-1.5 h-1.5 rounded-full bg-muted-foreground/30", i === 2 && "bg-muted-foreground/60")}
          />
        ))}
      </div>
    )
  }

  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col gap-1.5 items-center", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn("w-1.5 h-1.5 rounded-full bg-muted-foreground/30", i === 2 && "bg-muted-foreground/60")}
          />
        ))}
      </div>
    )
  }

  if (variant === "corner") {
    return (
      <div className={cn("grid grid-cols-3 gap-1", className)}>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground/10" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground/10" />
        <div className="w-1 h-1" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground/10" />
        <div className="w-1 h-1" />
        <div className="w-1 h-1" />
      </div>
    )
  }

  const gridPattern = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0]
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {gridPattern.map((val, i) => (
        <div
          key={i}
          className={cn("w-1 h-1 rounded-full", val ? "bg-muted-foreground/40" : "bg-muted-foreground/20")}
        />
      ))}
    </div>
  )
}
