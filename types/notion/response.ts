/**
 * Notion API Response Types
 */

import type { ISODate, NotionColor, NotionObject, NotionUser, UUID } from '@/types/notion/base';
import type { RichText } from '@/types/notion/content';

export interface PaginatedResponse<T extends NotionObject> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
  type: string;
  page_or_database?: Record<string, unknown>;
}

export interface DatabasePage extends NotionObject {
  object: 'page';
  created_time: ISODate;
  last_edited_time: ISODate;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: {
    type: string;
    [key: string]: unknown;
  } | null;
  icon: {
    type: string;
    [key: string]: unknown;
  } | null;
  parent: {
    type: 'database_id';
    database_id: UUID;
  };
  archived: boolean;
  properties: Record<string, PropertyValue>;
  url: string;
  public_url: string | null;
}

export type QueryDatabaseResponse = PaginatedResponse<DatabasePage>;

export type PropertyValue =
  | TitlePropertyValue
  | RichTextPropertyValue
  | NumberPropertyValue
  | CheckboxPropertyValue
  | SelectPropertyValue
  | MultiSelectPropertyValue
  | DatePropertyValue
  | PeoplePropertyValue
  | FilesPropertyValue
  | UrlPropertyValue
  | EmailPropertyValue
  | PhoneNumberPropertyValue
  | FormulaPropertyValue
  | RelationPropertyValue
  | RollupPropertyValue
  | CreatedTimePropertyValue
  | CreatedByPropertyValue
  | LastEditedTimePropertyValue
  | LastEditedByPropertyValue
  | StatusPropertyValue
  | UniqueIdPropertyValue;

interface BasePropertyValue {
  id: UUID;
  type: string;
}

export interface TitlePropertyValue extends BasePropertyValue {
  type: 'title';
  title: RichText[];
}

export interface RichTextPropertyValue extends BasePropertyValue {
  type: 'rich_text';
  rich_text: RichText[];
}

export interface NumberPropertyValue extends BasePropertyValue {
  type: 'number';
  number: number | null;
}

export interface CheckboxPropertyValue extends BasePropertyValue {
  type: 'checkbox';
  checkbox: boolean;
}

export interface SelectPropertyValue extends BasePropertyValue {
  type: 'select';
  select: {
    id: UUID;
    name: string;
    color: NotionColor;
  } | null;
}

export interface MultiSelectPropertyValue extends BasePropertyValue {
  type: 'multi_select';
  multi_select: Array<{
    id: UUID;
    name: string;
    color: NotionColor;
  }>;
}

export interface DatePropertyValue extends BasePropertyValue {
  type: 'date';
  date: {
    start: ISODate;
    end: ISODate | null;
    time_zone: string | null;
  } | null;
}

export interface PeoplePropertyValue extends BasePropertyValue {
  type: 'people';
  people: NotionUser[];
}

export interface FilesPropertyValue extends BasePropertyValue {
  type: 'files';
  files: Array<{
    name: string;
    type: 'file' | 'external';
    file?: { url: string; expiry_time: ISODate };
    external?: { url: string };
  }>;
}

export interface UrlPropertyValue extends BasePropertyValue {
  type: 'url';
  url: string | null;
}

export interface EmailPropertyValue extends BasePropertyValue {
  type: 'email';
  email: string | null;
}

export interface PhoneNumberPropertyValue extends BasePropertyValue {
  type: 'phone_number';
  phone_number: string | null;
}

export interface FormulaPropertyValue extends BasePropertyValue {
  type: 'formula';
  formula:
    | { type: 'string'; string: string | null }
    | { type: 'number'; number: number | null }
    | { type: 'boolean'; boolean: boolean }
    | { type: 'date'; date: { start: ISODate; end: ISODate | null } | null };
}

export interface RelationPropertyValue extends BasePropertyValue {
  type: 'relation';
  relation: Array<{ id: UUID }>;
  has_more?: boolean;
}

export interface RollupPropertyValue extends BasePropertyValue {
  type: 'rollup';
  rollup:
    | { type: 'number'; number: number | null; function: string }
    | { type: 'date'; date: { start: ISODate; end: ISODate | null } | null; function: string }
    | { type: 'array'; array: PropertyValue[]; function: string };
}

export interface CreatedTimePropertyValue extends BasePropertyValue {
  type: 'created_time';
  created_time: ISODate;
}

export interface CreatedByPropertyValue extends BasePropertyValue {
  type: 'created_by';
  created_by: NotionUser;
}

export interface LastEditedTimePropertyValue extends BasePropertyValue {
  type: 'last_edited_time';
  last_edited_time: ISODate;
}

export interface LastEditedByPropertyValue extends BasePropertyValue {
  type: 'last_edited_by';
  last_edited_by: NotionUser;
}

export interface StatusPropertyValue extends BasePropertyValue {
  type: 'status';
  status: {
    id: UUID;
    name: string;
    color: NotionColor;
  } | null;
}

export interface UniqueIdPropertyValue extends BasePropertyValue {
  type: 'unique_id';
  unique_id: {
    number: number;
    prefix: string | null;
  };
}
