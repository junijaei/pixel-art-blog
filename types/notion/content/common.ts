/* =====================================================
 * Common
 ===================================================== */

export type UUID = string;
export type ISODate = string;

export interface NotionUserRef {
  object: 'user';
  id: UUID;
}

export interface NotionParent {
  type: string;
  [key: string]: unknown;
}

type NotionColorBase = 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';

export type NotionColor = 'default' | NotionColorBase | `${NotionColorBase}_background`;
