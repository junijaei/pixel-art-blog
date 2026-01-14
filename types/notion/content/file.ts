import type { ISODate, UUID } from '../index';

/* =====================================================
 * File Object (Image, Video, Audio 공통)
 ===================================================== */

export type NotionFile =
  | {
      type: 'external';
      external: { url: string };
    }
  | {
      type: 'file';
      file: { url: string; expiry_time: ISODate };
    }
  | {
      type: 'file_upload';
      file_upload: { id: UUID };
    };
