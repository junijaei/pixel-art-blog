/**
 * Notion 블록 색상을 Tailwind CSS 클래스로 변환하는 유틸리티
 *
 * Notion API는 다음과 같은 color 값을 반환합니다:
 * - 텍스트 색상: 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'
 * - 배경 색상: 'gray_background', 'brown_background', ... (위와 동일 + '_background' suffix)
 * - 기본값: 'default'
 *
 * 사용 예시:
 *   getNotionColorClass('blue')            -> 'text-notion-blue'
 *   getNotionColorClass('blue_background') -> 'bg-notion-blue-bg border-notion-blue/20'
 */

import type { NotionColor } from '@/types/notion';

/**
 * Notion color 값이 배경 색상인지 확인합니다.
 */
export function isBackgroundColor(color: string): boolean {
  return color.endsWith('_background');
}

/**
 * Notion color 값에서 기본 색상 이름을 추출합니다.
 * 예: 'blue_background' -> 'blue', 'blue' -> 'blue'
 */
export function extractBaseColor(color: string): string {
  return color.replace('_background', '');
}

/**
 * Notion color를 Tailwind CSS 클래스로 직접 매핑
 * API에서 반환되는 값을 그대로 사용하여 적절한 클래스 반환
 *
 * @param color - Notion API의 color 값 (예: 'blue', 'gray_background')
 * @returns Tailwind CSS 클래스 문자열
 */
export function getNotionColorClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default') {
    return '';
  }

  // 배경 색상인 경우
  if (isBackgroundColor(color)) {
    const baseColor = extractBaseColor(color);
    return BACKGROUND_COLOR_MAP[baseColor] || '';
  }

  // 텍스트 색상인 경우
  return TEXT_COLOR_MAP[color] || '';
}

/**
 * 텍스트 색상 클래스 매핑
 */
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

/**
 * 배경 색상 클래스 매핑 (inline 스타일용 - 패딩 포함)
 */
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

/**
 * 블록 배경 색상 클래스 매핑 (Callout 등 블록 레벨용 - border 포함)
 */
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

/**
 * 블록 레벨 배경 색상 클래스 반환 (Callout, Quote 등)
 * border 스타일 포함
 */
export function getBlockBackgroundClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default') {
    return '';
  }

  const baseColor = extractBaseColor(color);
  return BLOCK_BACKGROUND_COLOR_MAP[baseColor] || BLOCK_BACKGROUND_COLOR_MAP.gray;
}
