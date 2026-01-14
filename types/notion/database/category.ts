/**
 * Category Database Types
 */

import type {
  DatabasePage,
  PropertyValue,
  TitlePropertyValue,
  RichTextPropertyValue,
  RelationPropertyValue,
  SelectPropertyValue,
  CreatedTimePropertyValue,
  LastEditedTimePropertyValue,
} from '@/types/notion';

export type CategoryStatus = 'active' | 'deactive';

export interface CategoryProperties {
  ID: PropertyValue;
  label: TitlePropertyValue;
  parent: RelationPropertyValue;
  path: RichTextPropertyValue;
  isActive: SelectPropertyValue;
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
  path: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  depth: number;
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
