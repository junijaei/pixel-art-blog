import type { NotionObject } from './base';

export interface PaginatedResponse<T extends NotionObject> {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
  type: string;
  page_or_database?: Record<string, unknown>;
}

export type QueryDatabaseResponse = PaginatedResponse<DatabasePage>;

export interface DatabasePage extends NotionObject {
  object: 'page';
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: 'user';
    id: string;
  };
  last_edited_by: {
    object: 'user';
    id: string;
  };
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
    database_id: string;
  };
  archived: boolean;
  properties: Record<string, PropertyValue>;
  url: string;
  public_url: string | null;
}

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
  | StatusPropertyValue;

export interface BasePropertyValue {
  id: string;
  type: string;
}

export interface TitlePropertyValue extends BasePropertyValue {
  type: 'title';
  title: Array<{
    type: 'text';
    text: { content: string; link: { url: string } | null };
    plain_text: string;
  }>;
}

export interface RichTextPropertyValue extends BasePropertyValue {
  type: 'rich_text';
  rich_text: Array<{
    type: 'text';
    text: { content: string; link: { url: string } | null };
    plain_text: string;
  }>;
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
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface MultiSelectPropertyValue extends BasePropertyValue {
  type: 'multi_select';
  multi_select: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export interface DatePropertyValue extends BasePropertyValue {
  type: 'date';
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

export interface PeoplePropertyValue extends BasePropertyValue {
  type: 'people';
  people: Array<{
    object: 'user';
    id: string;
  }>;
}

export interface FilesPropertyValue extends BasePropertyValue {
  type: 'files';
  files: Array<{
    name: string;
    type: 'file' | 'external';
    file?: { url: string; expiry_time: string };
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
    | { type: 'date'; date: { start: string; end: string | null } | null };
}

export interface RelationPropertyValue extends BasePropertyValue {
  type: 'relation';
  relation: Array<{ id: string }>;
  has_more?: boolean;
}

export interface RollupPropertyValue extends BasePropertyValue {
  type: 'rollup';
  rollup:
    | { type: 'number'; number: number | null; function: string }
    | { type: 'date'; date: { start: string; end: string | null } | null; function: string }
    | { type: 'array'; array: PropertyValue[]; function: string };
}

export interface CreatedTimePropertyValue extends BasePropertyValue {
  type: 'created_time';
  created_time: string;
}

export interface CreatedByPropertyValue extends BasePropertyValue {
  type: 'created_by';
  created_by: {
    object: 'user';
    id: string;
  };
}

export interface LastEditedTimePropertyValue extends BasePropertyValue {
  type: 'last_edited_time';
  last_edited_time: string;
}

export interface LastEditedByPropertyValue extends BasePropertyValue {
  type: 'last_edited_by';
  last_edited_by: {
    object: 'user';
    id: string;
  };
}

export interface StatusPropertyValue extends BasePropertyValue {
  type: 'status';
  status: {
    id: string;
    name: string;
    color: string;
  } | null;
}
