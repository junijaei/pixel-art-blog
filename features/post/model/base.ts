/**
 * Notion API Base Types
 */

export type UUID = string;
export type ISODate = string;

export type NotionObjectType = 'database' | 'page' | 'block' | 'list';

export interface NotionObject {
  object: NotionObjectType;
  id: UUID;
}

export interface NotionParent {
  type: 'database_id' | 'page_id' | 'workspace' | 'block_id';
  database_id?: UUID;
  page_id?: UUID;
  workspace?: true;
  block_id?: UUID;
}

export interface NotionUser {
  object: 'user';
  id: UUID;
  type?: 'person' | 'bot';
  name?: string;
  avatar_url?: string;
  person?: {
    email: string;
  };
  bot?: Record<string, unknown>;
}

export interface NotionDate {
  start: ISODate;
  end: ISODate | null;
  time_zone: string | null;
}

export interface NotionFile {
  type: 'file' | 'external';
  file?: {
    url: string;
    expiry_time: ISODate;
  };
  external?: {
    url: string;
  };
  name?: string;
  caption?: import('./content/rich-text').RichText[];
}

type NotionColorBase = 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
export type NotionColor = 'default' | NotionColorBase | `${NotionColorBase}_background`;
