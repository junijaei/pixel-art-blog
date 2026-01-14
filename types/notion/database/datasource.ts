/**
 * Database Schema Types
 */

import type { RichText, UUID, ISODate } from '@/types/notion';

export interface NotionDatabase {
  object: 'database';
  id: UUID;
  created_time: ISODate;
  last_edited_time: ISODate;
  title: RichText[];
  data_sources: NotionDataSource[];
}

export interface NotionDataSource {
  id: UUID;
  name: string;
  properties: Record<string, DatabaseProperty>;
}

export type DatabaseProperty =
  | TitleSchema
  | RichTextSchema
  | NumberSchema
  | SelectSchema
  | MultiSelectSchema
  | DateSchema
  | PeopleSchema
  | FilesSchema
  | CheckboxSchema
  | UrlSchema
  | EmailSchema
  | PhoneSchema
  | FormulaSchema
  | RelationSchema
  | RollupSchema
  | CreatedTimeSchema
  | CreatedBySchema
  | LastEditedTimeSchema
  | LastEditedBySchema
  | StatusSchema;

interface BaseSchema {
  id: string;
  name: string;
  type: string;
}

export interface TitleSchema extends BaseSchema {
  type: 'title';
  title: never;
}

export interface RichTextSchema extends BaseSchema {
  type: 'rich_text';
  rich_text: never;
}

export interface NumberSchema extends BaseSchema {
  type: 'number';
  number: { format: string };
}

export interface SelectSchema extends BaseSchema {
  type: 'select';
  select: {
    options: { id: UUID; name: string; color: string }[];
  };
}

export interface MultiSelectSchema extends BaseSchema {
  type: 'multi_select';
  multi_select: {
    options: { id: UUID; name: string; color: string }[];
  };
}

export interface DateSchema extends BaseSchema {
  type: 'date';
  date: never;
}

export interface PeopleSchema extends BaseSchema {
  type: 'people';
  people: never;
}

export interface FilesSchema extends BaseSchema {
  type: 'files';
  files: never;
}

export interface CheckboxSchema extends BaseSchema {
  type: 'checkbox';
  checkbox: never;
}

export interface UrlSchema extends BaseSchema {
  type: 'url';
  url: never;
}

export interface EmailSchema extends BaseSchema {
  type: 'email';
  email: never;
}

export interface PhoneSchema extends BaseSchema {
  type: 'phone_number';
  phone_number: never;
}

export interface FormulaSchema extends BaseSchema {
  type: 'formula';
  formula: { expression: string };
}

export interface RelationSchema extends BaseSchema {
  type: 'relation';
  relation: {
    database_id: UUID;
  };
}

export interface RollupSchema extends BaseSchema {
  type: 'rollup';
  rollup: {
    relation_property_name: string;
    function: string;
  };
}

export interface CreatedTimeSchema extends BaseSchema {
  type: 'created_time';
  created_time: never;
}

export interface CreatedBySchema extends BaseSchema {
  type: 'created_by';
  created_by: never;
}

export interface LastEditedTimeSchema extends BaseSchema {
  type: 'last_edited_time';
  last_edited_time: never;
}

export interface LastEditedBySchema extends BaseSchema {
  type: 'last_edited_by';
  last_edited_by: never;
}

export interface StatusSchema extends BaseSchema {
  type: 'status';
  status: {
    options: { id: UUID; name: string; color: string }[];
  };
}
