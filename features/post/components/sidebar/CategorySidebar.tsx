import { getCategories } from '@/features/post';
import { Sidebar } from './Sidebar';

/**
 * Server Component that owns the data-fetching responsibility:
 * it loads category data from Notion and feeds it to the pure
 * presentational {@link Sidebar}. Kept separate from the root layout
 * so it can be Suspense-wrapped, letting page content stream
 * immediately without waiting for the Notion API calls.
 */
export async function CategorySidebar() {
  const categories = await getCategories();
  return <Sidebar categories={categories.tree} />;
}
