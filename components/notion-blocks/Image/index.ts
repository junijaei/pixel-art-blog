import type { ImageBlock } from '@/types/notion';
import type { ReactNode } from 'react';

export { Image } from './Image';
export type { ImageBlock };

export interface ImageProps {
  block: ImageBlock;
  priority?: boolean;
  children?: ReactNode;
}
