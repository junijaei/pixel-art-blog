/**
 * Notion Color Utilities
 * Maps Notion colors to Tailwind CSS classes
 *
 * Safe for server/client use
 */

import type { NotionColor } from '@/features/post/model';

export function isBackgroundColor(color: string): boolean {
  return color.endsWith('_background');
}

export function extractBaseColor(color: string): string {
  return color.replace('_background', '');
}

/** 클래스명은 리터럴로 적을 것 — 조합하면 Tailwind가 유틸리티를 생성하지 않는다. */
const NOTION_COLOR_CLASSES = {
  gray: { text: 'text-notion-gray', bg: 'bg-notion-gray-bg', border: 'border-notion-gray/20' },
  brown: { text: 'text-notion-brown', bg: 'bg-notion-brown-bg', border: 'border-notion-brown/20' },
  orange: { text: 'text-notion-orange', bg: 'bg-notion-orange-bg', border: 'border-notion-orange/20' },
  yellow: { text: 'text-notion-yellow', bg: 'bg-notion-yellow-bg', border: 'border-notion-yellow/20' },
  green: { text: 'text-notion-green', bg: 'bg-notion-green-bg', border: 'border-notion-green/20' },
  blue: { text: 'text-notion-blue', bg: 'bg-notion-blue-bg', border: 'border-notion-blue/20' },
  purple: { text: 'text-notion-purple', bg: 'bg-notion-purple-bg', border: 'border-notion-purple/20' },
  pink: { text: 'text-notion-pink', bg: 'bg-notion-pink-bg', border: 'border-notion-pink/20' },
  red: { text: 'text-notion-red', bg: 'bg-notion-red-bg', border: 'border-notion-red/20' },
} as const satisfies Record<string, { text: string; bg: string; border: string }>;

type NotionColorBase = keyof typeof NOTION_COLOR_CLASSES;

function lookup(baseColor: string) {
  return NOTION_COLOR_CLASSES[baseColor as NotionColorBase];
}

export function getNotionColorClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default') {
    return '';
  }

  if (isBackgroundColor(color)) {
    return lookup(extractBaseColor(color))?.bg ?? '';
  }

  return lookup(color)?.text ?? '';
}

export function getBlockBackgroundClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default_background') {
    return '';
  }

  const classes = lookup(extractBaseColor(color)) ?? NOTION_COLOR_CLASSES.gray;
  return `${classes.bg} ${classes.border}`;
}
