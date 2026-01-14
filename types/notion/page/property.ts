/* =====================================
 * Page
 ===================================== */

import { RichText, UUID, ISODate } from '../index';

export interface NotionUser {
  object: 'user';
  id: UUID;
  name?: string;
  avatar_url?: string | null;
}

export interface ParentObject {
  type: string;
  [key: string]: any;
}

export interface NotionPage {
  object: 'page';
  id: UUID;
  created_time: ISODate;
  last_edited_time: ISODate;
  created_by?: NotionUser;
  last_edited_by?: NotionUser;
  parent: ParentObject;
  archived: boolean;
  in_trash?: boolean;
  url: string;
  public_url?: string | null;
  properties: Record<string, PagePropertyValue>;
}

/* =====================================
  * Page Property Values
  ===================================== */

export type PagePropertyValue =
  | TitleProperty
  | RichTextProperty
  | NumberProperty
  | SelectProperty
  | MultiSelectProperty
  | DateProperty
  | PeopleProperty
  | FilesProperty
  | CheckboxProperty
  | UrlProperty
  | EmailProperty
  | PhoneProperty
  | FormulaProperty
  | RelationProperty
  | RollupProperty
  | CreatedTimeProperty
  | CreatedByProperty
  | LastEditedTimeProperty
  | LastEditedByProperty;

interface BaseProperty {
  id: string;
  type: string;
}

export interface TitleProperty extends BaseProperty {
  type: 'title';
  title: RichText[];
}

export interface RichTextProperty extends BaseProperty {
  type: 'rich_text';
  rich_text: RichText[];
}

export interface NumberProperty extends BaseProperty {
  type: 'number';
  number: number | null;
}

export interface SelectProperty extends BaseProperty {
  type: 'select';
  select: { id: UUID; name: string; color: string } | null;
}

export interface MultiSelectProperty extends BaseProperty {
  type: 'multi_select';
  multi_select: { id: UUID; name: string; color: string }[];
}

export interface DateProperty extends BaseProperty {
  type: 'date';
  date: { start: string; end: string | null };
}

export interface PeopleProperty extends BaseProperty {
  type: 'people';
  people: NotionUser[];
}

export interface FilesProperty extends BaseProperty {
  type: 'files';
  files: {
    name: string;
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  }[];
}

export interface CheckboxProperty extends BaseProperty {
  type: 'checkbox';
  checkbox: boolean;
}

export interface UrlProperty extends BaseProperty {
  type: 'url';
  url: string | null;
}

export interface EmailProperty extends BaseProperty {
  type: 'email';
  email: string | null;
}

export interface PhoneProperty extends BaseProperty {
  type: 'phone_number';
  phone_number: string | null;
}

export interface FormulaProperty extends BaseProperty {
  type: 'formula';
  formula: {
    type: 'string' | 'number' | 'boolean' | 'date';
    string?: string;
    number?: number;
    boolean?: boolean;
    date?: { start: string; end: string | null };
  };
}

export interface RelationProperty extends BaseProperty {
  type: 'relation';
  relation: { id: UUID }[];
}

export interface RollupProperty extends BaseProperty {
  type: 'rollup';
  rollup: any;
}

export interface CreatedTimeProperty extends BaseProperty {
  type: 'created_time';
  created_time: string;
}

export interface CreatedByProperty extends BaseProperty {
  type: 'created_by';
  created_by: NotionUser;
}

export interface LastEditedTimeProperty extends BaseProperty {
  type: 'last_edited_time';
  last_edited_time: string;
}

export interface LastEditedByProperty extends BaseProperty {
  type: 'last_edited_by';
  last_edited_by: NotionUser;
}

/* =====================================
  * Property Item Object
  ===================================== */

export interface PropertyItem {
  object: 'property_item';
  id: string;
  type: string;
  [key: string]: any;
}

export interface PropertyItemList {
  object: 'list';
  type: 'property_item';
  results: PropertyItem[];
  next_cursor: string | null;
  has_more: boolean;
}
