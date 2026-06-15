/**
 * Lightweight placeholder shown while AsyncSidebar fetches data.
 * Matches the collapsed sidebar width (w-12) so layout does not shift.
 */
export function SidebarSkeleton() {
  return (
    <aside className="bg-sidebar border-sidebar-border hidden h-screen w-12 shrink-0 border-r sm:flex" aria-hidden />
  );
}
