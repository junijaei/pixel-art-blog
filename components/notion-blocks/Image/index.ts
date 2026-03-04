import type { ImageBlock } from '@/types/notion';

export { Image } from './Image';
export type { ImageBlock };

export interface ImageProps {
  block: ImageBlock;
  priority?: boolean;
}
