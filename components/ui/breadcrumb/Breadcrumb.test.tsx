import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb/Breadcrumb';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Breadcrumb', () => {
  const mockItems: BreadcrumbItem[] = [
    { label: 'All', path: '' },
    { label: 'Tech', path: 'tech' },
    { label: 'React', path: 'tech/react' },
  ];

  it('모든 breadcrumb 항목을 렌더링한다', () => {
    render(<Breadcrumb items={mockItems} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('각 항목이 올바른 링크를 가진다', () => {
    render(<Breadcrumb items={mockItems} />);

    const allLink = screen.getByText('All').closest('a');
    const techLink = screen.getByText('Tech').closest('a');
    const reactLink = screen.getByText('React').closest('a');

    expect(allLink).toHaveAttribute('href', '/posts');
    expect(techLink).toHaveAttribute('href', '/posts/tech');
    expect(reactLink).toHaveAttribute('href', '/posts/tech/react');
  });

  it('현재 카테고리가 강조 표시된다', () => {
    render(<Breadcrumb items={mockItems} currentPath="tech" />);

    const techLink = screen.getByText('Tech').closest('a');
    expect(techLink).toHaveClass('text-foreground');
    expect(techLink).toHaveClass('font-medium');
  });

  it('구분자가 마지막 항목 전까지만 표시된다', () => {
    const { container } = render(<Breadcrumb items={mockItems} />);

    // PixelChevronRight SVG 요소 찾기
    const chevrons = container.querySelectorAll('svg');
    // 첫 번째는 PixelTag, 나머지는 구분자
    // 3개 항목 -> 2개의 구분자 + 1개의 태그 = 3개의 SVG
    expect(chevrons.length).toBe(3);
  });

  it('단일 항목일 때 구분자가 표시되지 않는다', () => {
    const singleItem: BreadcrumbItem[] = [{ label: 'All', path: '' }];
    const { container } = render(<Breadcrumb items={singleItem} />);

    // PixelTag만 있고 PixelChevronRight는 없어야 함
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(1); // 태그 아이콘만
  });

  it('aria-label이 설정된다', () => {
    render(<Breadcrumb items={mockItems} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('className이 적용된다', () => {
    const { container } = render(<Breadcrumb items={mockItems} className="custom-class" />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-class');
  });
});
