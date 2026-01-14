export type NotionObjectType = 'database' | 'page' | 'block' | 'list';

export interface NotionObject {
  object: NotionObjectType;
  id: string;
}

export interface NotionParent {
  type: 'database_id' | 'page_id' | 'workspace' | 'block_id';
  database_id?: string;
  page_id?: string;
  workspace?: true;
  block_id?: string;
}

export interface NotionUser {
  object: 'user';
  id: string;
  type?: 'person' | 'bot';
  name?: string;
  avatar_url?: string;
  person?: {
    email: string;
  };
  bot?: Record<string, unknown>;
}

export interface NotionDate {
  start: string;
  end: string | null;
  time_zone: string | null;
}

export interface NotionFile {
  type: 'file' | 'external';
  file?: {
    url: string;
    expiry_time: string;
  };
  external?: {
    url: string;
  };
  name?: string;
}

export interface NotionRichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link: {
      url: string;
    } | null;
  };
  mention?: {
    type: string;
    [key: string]: unknown;
  };
  equation?: {
    expression: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}
