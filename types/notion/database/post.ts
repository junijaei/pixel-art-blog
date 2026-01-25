/**
 * Post Database Types
 */

import type {
  DatabasePage,
  PropertyValue,
  TitlePropertyValue,
  RichTextPropertyValue,
  RelationPropertyValue,
  StatusPropertyValue,
  CheckboxPropertyValue,
  DatePropertyValue,
  MultiSelectPropertyValue,
  CreatedTimePropertyValue,
  LastEditedTimePropertyValue,
} from '@/types/notion';

export type PostStatus = 'scheduled' | 'draft' | 'completed';

export interface PostProperties {
  ID: PropertyValue;
  title: TitlePropertyValue;
  category: RelationPropertyValue;
  status: StatusPropertyValue;
  description: RichTextPropertyValue;
  isPublished: CheckboxPropertyValue;
  publishedAt: DatePropertyValue;
  slug: RichTextPropertyValue;
  tag: MultiSelectPropertyValue;
  createdAt: CreatedTimePropertyValue;
  updatedAt: LastEditedTimePropertyValue;
}

export type PostPage = DatabasePage & {
  properties: PostProperties;
};

export interface Post {
  id: string;
  title: string;
  categoryId: string;
  status: PostStatus;
  description: string;
  isPublished: boolean;
  publishedAt: string;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostFilterOptions {
  publishedOnly?: boolean;
  categoryId?: string;
  tag?: string;
  status?: PostStatus;
}

export type PostSortField = 'title' | 'publishedAt' | 'createdAt' | 'updatedAt';

export interface PostSortOptions {
  field: PostSortField;
  direction: 'ascending' | 'descending';
}

export const DEFAULT_POST_SORT: PostSortOptions = {
  field: 'publishedAt',
  direction: 'descending',
};
