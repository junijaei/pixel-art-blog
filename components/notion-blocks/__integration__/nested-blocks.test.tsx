import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockRenderer } from '../BlockRenderer';
import {
  nestedBulletedListFixture,
  nestedNumberedListFixture,
  toggleWithParagraphFixture,
  toggleWithBulletedListFixture,
  toggleWithCodeFixture,
  calloutWithParagraphFixture,
  calloutWithBulletedListFixture,
} from './fixtures/simple-nested';

describe('Nested Blocks Integration - Phase 1', () => {
  describe('BulletedList Nesting', () => {
    it('2 depth 중첩된 불릿 리스트를 렌더링한다', () => {
      render(<BlockRenderer blocks={nestedBulletedListFixture} />);

      // 부모 아이템 확인
      expect(screen.getByText('Parent item 1')).toBeInTheDocument();

      // 자식 아이템 확인
      expect(screen.getByText('Child item 1-1')).toBeInTheDocument();
      expect(screen.getByText('Child item 1-2')).toBeInTheDocument();
    });

    it('중첩된 리스트가 올바른 HTML 구조를 가진다', () => {
      render(<BlockRenderer blocks={nestedBulletedListFixture} />);

      const parentLi = screen.getByText('Parent item 1').closest('li');
      expect(parentLi).toBeInTheDocument();

      // 부모 li 안에 중첩된 ul이 있는지 확인
      const nestedUl = parentLi?.querySelector('ul');
      expect(nestedUl).toBeInTheDocument();

      // 중첩된 ul 안에 자식 li들이 있는지 확인
      const childLis = nestedUl?.querySelectorAll('li');
      expect(childLis).toHaveLength(2);
    });

    it('중첩된 리스트에 적절한 스타일이 적용된다', () => {
      render(<BlockRenderer blocks={nestedBulletedListFixture} />);

      const parentLi = screen.getByText('Parent item 1').closest('li');
      const nestedUl = parentLi?.querySelector('ul');

      // mt-2 space-y-2 클래스가 적용되어야 함
      expect(nestedUl).toHaveClass('mt-2', 'space-y-2');
    });
  });

  describe('NumberedList Nesting', () => {
    it('2 depth 중첩된 번호 리스트를 렌더링한다', () => {
      render(<BlockRenderer blocks={nestedNumberedListFixture} />);

      // 부모 아이템 확인
      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();

      // 자식 아이템 확인
      expect(screen.getByText('Nested item 1')).toBeInTheDocument();
      expect(screen.getByText('Nested item 2')).toBeInTheDocument();
    });

    it('index가 각 depth에서 올바르게 표시된다', () => {
      render(<BlockRenderer blocks={nestedNumberedListFixture} />);

      // 부모 레벨: 1, 2
      const numbers = screen.getAllByText(/^[0-9]+$/);

      // 최소 4개의 숫자가 있어야 함 (부모 2개 + 자식 2개)
      expect(numbers.length).toBeGreaterThanOrEqual(4);

      // 첫 번째 항목은 "1"이어야 함
      expect(numbers[0]).toHaveTextContent('1');
      // 두 번째 항목은 "2"여야 함
      expect(numbers[1]).toHaveTextContent('2');
    });

    it('중첩된 번호 리스트가 ol 태그로 렌더링된다', () => {
      render(<BlockRenderer blocks={nestedNumberedListFixture} />);

      const secondItem = screen.getByText('Second item').closest('li');
      const nestedOl = secondItem?.querySelector('ol');

      expect(nestedOl).toBeInTheDocument();
      expect(nestedOl).toHaveClass('mt-2', 'space-y-2');
    });
  });

  describe('Toggle Nesting', () => {
    it('Toggle 안에 Paragraph를 렌더링한다', () => {
      render(<BlockRenderer blocks={toggleWithParagraphFixture} />);

      // Toggle 헤더 확인
      expect(screen.getByText('Click to expand')).toBeInTheDocument();

      // 초기에는 children이 보이지 않음
      expect(screen.queryByText('Hidden paragraph content')).not.toBeInTheDocument();

      // Toggle 클릭
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // 이제 children이 보임
      expect(screen.getByText('Hidden paragraph content')).toBeInTheDocument();
    });

    it('Toggle 안에 BulletedList를 렌더링한다', () => {
      render(<BlockRenderer blocks={toggleWithBulletedListFixture} />);

      expect(screen.getByText('Toggle with list')).toBeInTheDocument();

      // 초기에는 리스트가 보이지 않음
      expect(screen.queryByText('Bullet item 1')).not.toBeInTheDocument();

      // Toggle 클릭
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // 이제 리스트가 보임
      expect(screen.getByText('Bullet item 1')).toBeInTheDocument();
      expect(screen.getByText('Bullet item 2')).toBeInTheDocument();
    });

    it('Toggle 안에 Code를 렌더링한다', () => {
      render(<BlockRenderer blocks={toggleWithCodeFixture} />);

      expect(screen.getByText('Toggle with code')).toBeInTheDocument();

      // Toggle 클릭
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Code 블록 확인
      expect(screen.getByText('console.log("Hello World");')).toBeInTheDocument();
    });

    it('Toggle을 여러 번 클릭하면 open/close가 전환된다', () => {
      render(<BlockRenderer blocks={toggleWithParagraphFixture} />);

      const button = screen.getByRole('button');

      // 첫 번째 클릭 - 열기
      fireEvent.click(button);
      expect(screen.getByText('Hidden paragraph content')).toBeInTheDocument();

      // 두 번째 클릭 - 닫기
      fireEvent.click(button);
      expect(screen.queryByText('Hidden paragraph content')).not.toBeInTheDocument();

      // 세 번째 클릭 - 다시 열기
      fireEvent.click(button);
      expect(screen.getByText('Hidden paragraph content')).toBeInTheDocument();
    });
  });

  describe('Callout Nesting', () => {
    it('Callout 안에 Paragraph를 렌더링한다', () => {
      render(<BlockRenderer blocks={calloutWithParagraphFixture} />);

      // Callout 콘텐츠 확인
      expect(screen.getByText('Important information')).toBeInTheDocument();
      expect(screen.getByText('💡')).toBeInTheDocument();

      // Nested paragraph 확인
      expect(screen.getByText('Details about the callout')).toBeInTheDocument();
    });

    it('Callout 안에 BulletedList를 렌더링한다', () => {
      render(<BlockRenderer blocks={calloutWithBulletedListFixture} />);

      // Callout 콘텐츠 확인
      expect(screen.getByText('Key points')).toBeInTheDocument();
      expect(screen.getByText('📝')).toBeInTheDocument();

      // Nested list 확인
      expect(screen.getByText('Point 1')).toBeInTheDocument();
      expect(screen.getByText('Point 2')).toBeInTheDocument();
    });

    it('Callout에 배경색 variant가 적용된다', () => {
      const { container } = render(<BlockRenderer blocks={calloutWithParagraphFixture} />);

      // Callout의 최상위 div를 찾기 (rounded-xl 클래스를 가진 div)
      const calloutDiv = container.querySelector('.rounded-xl');

      expect(calloutDiv).toBeInTheDocument();
      expect(calloutDiv).toHaveClass('rounded-xl', 'border', 'p-4');
    });

    it('Callout children이 적절한 간격으로 렌더링된다', () => {
      const { container } = render(<BlockRenderer blocks={calloutWithParagraphFixture} />);

      // Callout 내부의 children container 찾기
      const calloutDiv = container.querySelector('.rounded-xl');
      const childrenContainer = calloutDiv?.querySelector('.mt-2');

      expect(childrenContainer).toBeInTheDocument();
      expect(childrenContainer).toHaveClass('mt-2', 'space-y-1');
    });
  });

  describe('Mixed Nesting', () => {
    it('BulletedListItem 안에 NumberedListItem을 렌더링한다', () => {
      const mixedFixture = [
        {
          ...nestedBulletedListFixture[0],
          children: [
            {
              ...nestedNumberedListFixture[0],
              id: 'mixed-numbered-1',
              parent: { type: 'block_id' as const, block_id: nestedBulletedListFixture[0].id },
            },
          ],
        },
      ];

      render(<BlockRenderer blocks={mixedFixture} />);

      expect(screen.getByText('Parent item 1')).toBeInTheDocument();
      expect(screen.getByText('First item')).toBeInTheDocument();
    });

    it('NumberedListItem 안에 BulletedListItem을 렌더링한다', () => {
      const mixedFixture = [
        {
          ...nestedNumberedListFixture[0],
          has_children: true,
          children: [
            {
              ...nestedBulletedListFixture[0],
              id: 'mixed-bulleted-1',
              has_children: false,
              children: undefined,
              parent: { type: 'block_id' as const, block_id: nestedNumberedListFixture[0].id },
            },
          ],
        },
      ];

      render(<BlockRenderer blocks={mixedFixture} />);

      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Parent item 1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('children이 빈 배열일 때 gracefully 처리한다', () => {
      const emptyChildrenFixture = [
        {
          ...nestedBulletedListFixture[0],
          has_children: true,
          children: [],
        },
      ];

      render(<BlockRenderer blocks={emptyChildrenFixture} />);

      expect(screen.getByText('Parent item 1')).toBeInTheDocument();
      // 에러 없이 렌더링되어야 함
    });

    it('has_children이 false지만 children prop이 있을 때 렌더링하지 않는다', () => {
      const inconsistentFixture = [
        {
          ...nestedBulletedListFixture[0],
          has_children: false,
          // children은 여전히 존재
        },
      ];

      render(<BlockRenderer blocks={inconsistentFixture} />);

      expect(screen.getByText('Parent item 1')).toBeInTheDocument();
      // has_children이 false이므로 children이 렌더링되지 않아야 함
      expect(screen.queryByText('Child item 1-1')).not.toBeInTheDocument();
    });

    it('빈 blocks 배열을 처리한다', () => {
      render(<BlockRenderer blocks={[]} />);

      // 에러 없이 아무것도 렌더링하지 않아야 함
      const container = document.body;
      expect(container.textContent).toBe('');
    });
  });
});
