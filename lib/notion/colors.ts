/**
 * Notion Color Utilities
 * Maps Notion colors to Tailwind CSS classes
 *
 * Safe for server/client use
 */

import type { NotionColor } from '@/types/notion';

export function isBackgroundColor(color: string): boolean {
  return color.endsWith('_background');
}

export function extractBaseColor(color: string): string {
  return color.replace('_background', '');
}

const TEXT_COLOR_MAP: Record<string, string> = {
  gray: 'text-notion-gray',
  brown: 'text-notion-brown',
  orange: 'text-notion-orange',
  yellow: 'text-notion-yellow',
  green: 'text-notion-green',
  blue: 'text-notion-blue',
  purple: 'text-notion-purple',
  pink: 'text-notion-pink',
  red: 'text-notion-red',
};

const BACKGROUND_COLOR_MAP: Record<string, string> = {
  gray: 'bg-notion-gray-bg',
  brown: 'bg-notion-brown-bg',
  orange: 'bg-notion-orange-bg',
  yellow: 'bg-notion-yellow-bg',
  green: 'bg-notion-green-bg',
  blue: 'bg-notion-blue-bg',
  purple: 'bg-notion-purple-bg',
  pink: 'bg-notion-pink-bg',
  red: 'bg-notion-red-bg',
};

const BLOCK_BACKGROUND_COLOR_MAP: Record<string, string> = {
  gray: 'bg-notion-gray-bg border-notion-gray/20',
  brown: 'bg-notion-brown-bg border-notion-brown/20',
  orange: 'bg-notion-orange-bg border-notion-orange/20',
  yellow: 'bg-notion-yellow-bg border-notion-yellow/20',
  green: 'bg-notion-green-bg border-notion-green/20',
  blue: 'bg-notion-blue-bg border-notion-blue/20',
  purple: 'bg-notion-purple-bg border-notion-purple/20',
  pink: 'bg-notion-pink-bg border-notion-pink/20',
  red: 'bg-notion-red-bg border-notion-red/20',
};

export function getNotionColorClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default') {
    return '';
  }

  if (isBackgroundColor(color)) {
    const baseColor = extractBaseColor(color);
    return BACKGROUND_COLOR_MAP[baseColor] || '';
  }

  return TEXT_COLOR_MAP[color] || '';
}

export function getBlockBackgroundClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default_background') {
    return '';
  }

  const baseColor = extractBaseColor(color);
  return BLOCK_BACKGROUND_COLOR_MAP[baseColor] || BLOCK_BACKGROUND_COLOR_MAP.gray;
}
