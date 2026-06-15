import { Sidebar } from '@/shared/layouts';
import { getCategories } from '@/features/post';

/**
 * Server Component that fetches category data and renders Sidebar.
 * Isolated from the root layout so it can be Suspense-wrapped,
 * allowing page content to stream immediately without waiting for
 * the Notion API calls.
 */
export async function AsyncSidebar() {
  const categories = await getCategories();
  return <Sidebar categories={categories.tree} />;
}
