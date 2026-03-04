import { Sidebar } from '@/components/layouts';
import { getCategoryTree } from '@/lib/notion';

/**
 * Server Component that fetches category data and renders Sidebar.
 * Isolated from the root layout so it can be Suspense-wrapped,
 * allowing page content to stream immediately without waiting for
 * the Notion API calls.
 */
export async function AsyncSidebar() {
  const categories = await getCategoryTree();
  return <Sidebar categories={categories} />;
}
