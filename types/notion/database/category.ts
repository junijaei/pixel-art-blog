/**
 * Category Database Types
 */

import type {
  CreatedTimePropertyValue,
  DatabasePage,
  LastEditedTimePropertyValue,
  PropertyValue,
  RelationPropertyValue,
  RichTextPropertyValue,
  RollupPropertyValue,
  SelectPropertyValue,
  TitlePropertyValue,
} from '@/types/notion';

export type CategoryStatus = 'active' | 'deactive';

export interface CategoryProperties {
  ID: PropertyValue;
  label: TitlePropertyValue;
  parent: RelationPropertyValue;
  children: RelationPropertyValue;
  path: RichTextPropertyValue;
  isActive: SelectPropertyValue;
  postCount: RollupPropertyValue;
  createdAt: CreatedTimePropertyValue;
  updatedAt: LastEditedTimePropertyValue;
}

export type CategoryPage = DatabasePage & {
  properties: CategoryProperties;
};

export interface Category {
  id: string;
  label: string;
  parentId: string | null;
  hasChildren: boolean;
  path: string;
  isActive: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  depth: number;
  /** Self post count + all descendant counts (computed server-side) */
  cumulativePostCount: number;
}

export interface CategoryWithFullPath extends Category {
  fullPath: string;
}

export interface CategoryFilterOptions {
  activeOnly?: boolean;
  parentId?: string;
  rootOnly?: boolean;
}

export type CategorySortField = 'label' | 'createdAt' | 'updatedAt' | 'path';

export interface CategorySortOptions {
  field: CategorySortField;
  direction: 'ascending' | 'descending';
}
