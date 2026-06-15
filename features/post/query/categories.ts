import type { QueryDataSourceParameters } from '@notionhq/client/build/src/api-endpoints';

import { fetchCategoryPages } from '@/features/post/api/category';
import { CATEGORY_PROPERTIES, CATEGORY_STATUS, ISR_CONFIG } from '@/features/post/constants';
import { buildCategoryMaps, buildCategoryTree, toCategories } from '@/features/post/transform/categories';
import type { Category, CategoryTreeNode, CategoryWithFullPath } from '@/features/post/model';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

export interface CategoriesQueryResult {
  items: Category[];
  maps: {
    byId: Map<string, CategoryWithFullPath>;
    byFullPath: Map<string, CategoryWithFullPath>;
  };
  tree: CategoryTreeNode[];
}

export interface GetCategoriesOptions {
  id?: string;
  path?: string;
}

type DataSourceFilter = QueryDataSourceParameters['filter'];
type DataSourceSorts = QueryDataSourceParameters['sorts'];

const ACTIVE_CATEGORY_FILTER: DataSourceFilter = {
  property: CATEGORY_PROPERTIES.IS_ACTIVE,
  select: {
    equals: CATEGORY_STATUS.ACTIVE,
  },
};

const DEFAULT_CATEGORY_SORTS: DataSourceSorts = [
  {
    property: CATEGORY_PROPERTIES.CREATED_AT,
    direction: 'ascending',
  },
];

const fetchCategoriesCached = unstable_cache(
  async () =>
    toCategories(
      await fetchCategoryPages(ISR_CONFIG.CATEGORY_DATABASE_ID, {
        filter: ACTIVE_CATEGORY_FILTER,
        sorts: DEFAULT_CATEGORY_SORTS,
      })
    ),
  ['notion-categories'],
  { revalidate: 3600 }
);

const getAllCategories = cache(async (): Promise<CategoriesQueryResult> => {
  const items = await fetchCategoriesCached();
  const maps = buildCategoryMaps(items);
  const tree = buildCategoryTree(items);

  return { items, maps, tree };
});

export async function getCategories(options: GetCategoriesOptions = {}): Promise<CategoriesQueryResult> {
  const categories = await getAllCategories();

  if (!options.id && !options.path) {
    return categories;
  }

  const filtered = options.id
    ? categories.items.filter((category) => category.id === options.id)
    : categories.items.filter((category) => category.path === options.path);

  const maps = buildCategoryMaps(filtered);
  const tree = buildCategoryTree(filtered);

  return { items: filtered, maps, tree };
}
