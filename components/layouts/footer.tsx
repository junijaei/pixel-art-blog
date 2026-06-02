export function BlogFooter() {
  return (
    <footer className="border-border/70 relative mt-16 border-t py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-muted-foreground font-pixel text-xs tracking-wider">BIT BY BIT</span>
          </div>

          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Bit by Bit Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
