import type { NotionComment } from '@/features/post/model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentWrapper } from './CommentWrapper';

// createPortal을 인라인 렌더링으로 대체하여 jsdom에서 팝오버 내용 접근 가능
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

function makeComment(overrides: Partial<NotionComment> = {}): NotionComment {
  return {
    object: 'comment',
    id: 'comment-1',
    parent: { type: 'block_id', block_id: 'block-1' },
    discussion_id: 'discussion-1',
    created_time: '2026-01-15T10:30:00.000Z',
    last_edited_time: '2026-01-15T10:30:00.000Z',
    created_by: { object: 'user', id: 'user-1', name: '전희재', avatar_url: undefined },
    rich_text: [
      {
        type: 'text',
        text: { content: '이 부분에 대한 추가 설명입니다.', link: null },
        annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
        plain_text: '이 부분에 대한 추가 설명입니다.',
        href: null,
      },
    ],
    ...overrides,
  };
}

describe('CommentWrapper', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('렌더링', () => {
    it('블록 본문을 렌더링한다', () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록 내용입니다.</p>
        </CommentWrapper>
      );
      expect(screen.getByText('블록 내용입니다.')).toBeInTheDocument();
    });

    it('트리거 버튼을 렌더링한다', () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      expect(screen.getByRole('button', { name: /추가 설명/ })).toBeInTheDocument();
    });

    it('기본 상태에서 aria-expanded가 false이다', () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      expect(screen.getByRole('button', { name: /추가 설명/ })).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('팝오버 열기/닫기', () => {
    it('삼각형 클릭 시 팝오버가 열린다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      await waitFor(() => {
        expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument();
      });
    });

    it('팝오버 열림 시 aria-expanded가 true가 된다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      const trigger = screen.getByRole('button', { name: /추가 설명/ });
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('본문 클릭 시 팝오버가 토글된다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록 내용입니다.</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByText('블록 내용입니다.'));
      await waitFor(() => expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument());

      fireEvent.click(screen.getByText('블록 내용입니다.'));
      await waitFor(() => expect(screen.queryByText('이 부분에 대한 추가 설명입니다.')).not.toBeInTheDocument());
    });

    it('닫기 버튼 클릭 시 팝오버가 닫힌다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      await waitFor(() => expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument());

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      await waitFor(() => expect(screen.queryByText('이 부분에 대한 추가 설명입니다.')).not.toBeInTheDocument());
    });
  });

  describe('팝오버 내부 클릭', () => {
    it('팝오버 내부 mousedown 시 닫히지 않는다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      await waitFor(() => expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument());

      // 팝오버 내부 텍스트를 mousedown (스크롤 시도를 시뮬레이션)
      fireEvent.mouseDown(screen.getByText('이 부분에 대한 추가 설명입니다.'));
      // 팝오버가 유지되어야 함
      expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument();
    });
  });

  describe('다중 설명', () => {
    it('여러 댓글이 있을 때 모두 표시한다', async () => {
      render(
        <CommentWrapper
          comments={[
            makeComment({ id: 'c-1' }),
            makeComment({
              id: 'c-2',
              rich_text: [
                {
                  type: 'text',
                  text: { content: '두 번째 설명입니다.', link: null },
                  annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
                  plain_text: '두 번째 설명입니다.',
                  href: null,
                },
              ],
            }),
          ]}
        >
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      await waitFor(() => {
        expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument();
        expect(screen.getByText('두 번째 설명입니다.')).toBeInTheDocument();
      });
    });

    it('댓글이 2개 이상이면 개수 뱃지를 표시한다', async () => {
      render(
        <CommentWrapper comments={[makeComment({ id: 'c-1' }), makeComment({ id: 'c-2' })]}>
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      // 헤더 뱃지(2)와 번호 표시(1, 2)가 함께 렌더링됨
      await waitFor(() => {
        expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('헤더 UI', () => {
    it('팝오버 헤더에 "추가 설명" 레이블이 있다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      // 하단 레이블 + 팝오버 헤더 = 2개 이상
      await waitFor(() => {
        expect(screen.getAllByText('추가 설명').length).toBeGreaterThanOrEqual(2);
      });
    });

    it('작성자 이름이나 날짜를 표시하지 않는다', async () => {
      render(
        <CommentWrapper comments={[makeComment()]}>
          <p>블록</p>
        </CommentWrapper>
      );
      fireEvent.click(screen.getByRole('button', { name: /추가 설명/ }));
      await waitFor(() => expect(screen.getByText('이 부분에 대한 추가 설명입니다.')).toBeInTheDocument());

      expect(screen.queryByText('전희재')).not.toBeInTheDocument();
      expect(screen.queryByText(/2026년/)).not.toBeInTheDocument();
    });
  });
});
