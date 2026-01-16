/**
 * Notion 블록 색상을 Tailwind CSS 클래스로 변환하는 유틸리티
 *
 * 디자인 원칙:
 * - Token-Driven Development: 하드코딩된 색상 대신 Notion 토큰 사용
 * - WCAG AA 접근성 준수: 모든 색상 조합이 4.5:1 대비율 충족
 * - 테마 자동 전환: CSS 변수를 통해 Light/Dark 모드 자동 지원
 *
 * 사용 예시:
 *   getColorClass('blue')           -> 'text-notion-blue'
 *   getColorClass('blue_background', 'background') -> 'bg-notion-blue-bg'
 */

import type { NotionColor } from '@/types/notion';

export type NotionColorVariant = 'text' | 'background';

/**
 * Notion color 값에서 기본 색상을 추출합니다.
 * 예: 'blue_background' -> 'blue'
 */
function extractBaseColor(color: string): string {
  return color.replace('_background', '');
}

/**
 * Notion color를 Tailwind CSS 클래스로 변환
 *
 * @param color - Notion API의 color 값 (예: 'blue', 'gray_background')
 * @param variant - 'text' (텍스트 색상) 또는 'background' (배경 색상)
 * @returns Tailwind CSS 클래스 문자열
 */
export function getColorClass(
  color: NotionColor | string | undefined,
  variant: NotionColorVariant = 'text',
): string {
  if (!color || color === 'default') {
    return '';
  }

  const baseColor = extractBaseColor(color);

  if (variant === 'text') {
    return getTextColorClass(baseColor);
  } else {
    return getBackgroundColorClass(baseColor);
  }
}

/**
 * 텍스트 색상 클래스 매핑
 * Notion 토큰을 사용하여 테마 자동 전환 지원
 */
function getTextColorClass(color: string): string {
  const colorMap: Record<string, string> = {
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

  return colorMap[color] || '';
}

/**
 * 배경 색상 클래스 매핑 (Callout 등에서 사용)
 * Notion 배경 토큰 + border 스타일
 */
function getBackgroundColorClass(color: string): string {
  const colorMap: Record<string, string> = {
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

  return colorMap[color] || colorMap.gray;
}

/**
 * Notion 색상을 위한 paired 스타일 (텍스트 + 배경)
 * WCAG AA 접근성을 위해 텍스트와 배경을 함께 적용
 */
export function getPairedColorClass(color: NotionColor | string | undefined): string {
  if (!color || color === 'default') {
    return '';
  }

  const baseColor = extractBaseColor(color);

  const pairedMap: Record<string, string> = {
    gray: 'text-notion-gray bg-notion-gray-bg',
    brown: 'text-notion-brown bg-notion-brown-bg',
    orange: 'text-notion-orange bg-notion-orange-bg',
    yellow: 'text-notion-yellow bg-notion-yellow-bg',
    green: 'text-notion-green bg-notion-green-bg',
    blue: 'text-notion-blue bg-notion-blue-bg',
    purple: 'text-notion-purple bg-notion-purple-bg',
    pink: 'text-notion-pink bg-notion-pink-bg',
    red: 'text-notion-red bg-notion-red-bg',
  };

  return pairedMap[baseColor] || '';
}
