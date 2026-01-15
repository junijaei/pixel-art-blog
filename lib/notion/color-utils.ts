/**
 * Notion 블록 색상을 Tailwind CSS 클래스로 변환하는 유틸리티
 *
 * 디자인 원칙:
 * - 낮은 채도의 차분한 색상 사용
 * - 모노크롬 중심 디자인 유지
 * - 다크모드 완전 지원
 */

export type NotionColorVariant = 'text' | 'background';

/**
 * Notion color를 Tailwind CSS 클래스로 변환
 *
 * @param color - Notion API의 color 값
 * @param variant - 'text' (텍스트 색상) 또는 'background' (배경 색상)
 * @returns Tailwind CSS 클래스 문자열
 */
export function getColorClass(color: string | undefined, variant: NotionColorVariant = 'text'): string {
  if (!color || color === 'default') {
    return '';
  }

  // background variant 처리 (예: "gray_background" -> "gray")
  const baseColor = color.replace('_background', '');

  if (variant === 'text') {
    return getTextColorClass(baseColor);
  } else {
    return getBackgroundColorClass(baseColor);
  }
}

/**
 * 텍스트 색상 클래스 매핑
 * 차분하고 읽기 좋은 색상 사용 (700/400)
 */
function getTextColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    gray: 'text-neutral-700 dark:text-neutral-400',
    brown: 'text-amber-800 dark:text-amber-400',
    orange: 'text-orange-700 dark:text-orange-400',
    yellow: 'text-yellow-700 dark:text-yellow-400',
    green: 'text-green-700 dark:text-green-400',
    blue: 'text-blue-700 dark:text-blue-400',
    purple: 'text-purple-700 dark:text-purple-400',
    pink: 'text-pink-700 dark:text-pink-400',
    red: 'text-red-700 dark:text-red-400',
  };

  return colorMap[color] || '';
}

/**
 * 배경 색상 클래스 매핑 (Callout 등에서 사용)
 * 연하고 부드러운 배경 + 다크모드 지원
 */
function getBackgroundColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    gray: 'bg-muted/50 border-muted-foreground/20 dark:bg-muted/30 dark:border-muted-foreground/10',
    brown: 'bg-amber-50/60 border-amber-300/40 dark:bg-amber-950/20 dark:border-amber-800/30',
    orange: 'bg-orange-50/60 border-orange-300/40 dark:bg-orange-950/20 dark:border-orange-800/30',
    yellow: 'bg-yellow-50/60 border-yellow-300/40 dark:bg-yellow-950/20 dark:border-yellow-800/30',
    green: 'bg-green-50/60 border-green-300/40 dark:bg-green-950/20 dark:border-green-800/30',
    blue: 'bg-blue-50/60 border-blue-300/40 dark:bg-blue-950/20 dark:border-blue-800/30',
    purple: 'bg-purple-50/60 border-purple-300/40 dark:bg-purple-950/20 dark:border-purple-800/30',
    pink: 'bg-pink-50/60 border-pink-300/40 dark:bg-pink-950/20 dark:border-pink-800/30',
    red: 'bg-red-50/60 border-red-300/40 dark:bg-red-950/20 dark:border-red-800/30',
  };

  return colorMap[color] || colorMap.gray;
}
