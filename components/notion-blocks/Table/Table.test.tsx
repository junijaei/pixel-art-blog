import { Table } from '@/components/notion-blocks/Table/Table';
import type { TableBlock, TableRowBlock } from '@/types/notion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// ============================================================
// Test Fixtures
// ============================================================

const DEFAULT_BLOCK_META = {
  object: 'block' as const,
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  archived: false,
  in_trash: false,
  parent: { type: 'page_id' as const, page_id: 'page-1' },
};

let rowIdCounter = 0;

function createTableRow(cellTexts: string[]): TableRowBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: `row-${++rowIdCounter}`,
    has_children: false,
    type: 'table_row',
    table_row: {
      cells: cellTexts.map((text) => [
        {
          type: 'text',
          text: { content: text, link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: text,
          href: null,
        },
      ]),
    },
  };
}

function createTableBlock(
  rows: TableRowBlock[],
  options: { has_column_header?: boolean; has_row_header?: boolean } = {}
): TableBlock {
  return {
    ...DEFAULT_BLOCK_META,
    id: 'table-1',
    has_children: rows.length > 0,
    children: rows,
    type: 'table',
    table: {
      table_width: rows[0]?.table_row.cells.length ?? 0,
      has_column_header: options.has_column_header ?? false,
      has_row_header: options.has_row_header ?? false,
    },
  };
}

// ============================================================
// Tests
// ============================================================

describe('Table', () => {
  it('기본 테이블을 렌더링한다', () => {
    const rows = [createTableRow(['이름', '나이']), createTableRow(['Alice', '30'])];
    const block = createTableBlock(rows);

    const { container } = render(<Table block={block} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('children이 없으면 null을 반환한다', () => {
    const block = createTableBlock([]);
    const { container } = render(<Table block={block} />);
    expect(container.firstChild).toBeNull();
  });

  it('has_column_header가 true이면 첫 번째 행을 thead로 렌더링한다', () => {
    const rows = [createTableRow(['이름', '역할']), createTableRow(['Alice', '개발자'])];
    const block = createTableBlock(rows, { has_column_header: true });

    const { container } = render(<Table block={block} />);

    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();

    // 헤더 행은 th[scope="col"]로 렌더링
    const headerCells = thead?.querySelectorAll('th[scope="col"]');
    expect(headerCells).toHaveLength(2);
    expect(headerCells?.[0]).toHaveTextContent('이름');
    expect(headerCells?.[1]).toHaveTextContent('역할');

    // 본문 행은 tbody에
    const bodyRows = tbody?.querySelectorAll('tr');
    expect(bodyRows).toHaveLength(1);
    expect(bodyRows?.[0]).toHaveTextContent('Alice');
  });

  it('has_column_header가 false이면 thead 없이 tbody만 렌더링한다', () => {
    const rows = [createTableRow(['A', 'B']), createTableRow(['C', 'D'])];
    const block = createTableBlock(rows, { has_column_header: false });

    const { container } = render(<Table block={block} />);

    expect(container.querySelector('thead')).not.toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();

    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows).toHaveLength(2);
  });

  it('has_row_header가 true이면 첫 번째 열을 th[scope="row"]로 렌더링한다', () => {
    const rows = [createTableRow(['항목', '값']), createTableRow(['이름', 'Alice'])];
    const block = createTableBlock(rows, { has_row_header: true });

    const { container } = render(<Table block={block} />);

    const rowHeader = container.querySelector('tbody th[scope="row"]');
    expect(rowHeader).toBeInTheDocument();
    expect(rowHeader).toHaveTextContent('항목');
  });

  it('has_column_header와 has_row_header가 모두 true인 경우 올바르게 렌더링한다', () => {
    const rows = [
      createTableRow(['', '1월', '2월']),
      createTableRow(['매출', '100', '200']),
      createTableRow(['비용', '50', '80']),
    ];
    const block = createTableBlock(rows, { has_column_header: true, has_row_header: true });

    const { container } = render(<Table block={block} />);

    // 헤더 행: thead > tr > th[scope="col"]
    const colHeaders = container.querySelectorAll('thead th[scope="col"]');
    expect(colHeaders).toHaveLength(3);

    // 본문 첫 번째 열: th[scope="row"]
    const rowHeaders = container.querySelectorAll('tbody th[scope="row"]');
    expect(rowHeaders).toHaveLength(2);
    expect(rowHeaders[0]).toHaveTextContent('매출');
    expect(rowHeaders[1]).toHaveTextContent('비용');

    // 본문 데이터 셀: td
    const dataCells = container.querySelectorAll('tbody td');
    expect(dataCells).toHaveLength(4); // 2행 × 2열
  });

  it('빈 셀을 올바르게 렌더링한다', () => {
    const block = createTableBlock([createTableRow(['', '내용'])]);

    const { container } = render(<Table block={block} />);
    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(2);
  });

  it('overflow-x-auto 래퍼를 가진다', () => {
    const block = createTableBlock([createTableRow(['A'])]);

    const { container } = render(<Table block={block} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('overflow-x-auto');
  });

  it('여러 행을 모두 렌더링한다', () => {
    const rows = [
      createTableRow(['1행1열', '1행2열']),
      createTableRow(['2행1열', '2행2열']),
      createTableRow(['3행1열', '3행2열']),
    ];
    const block = createTableBlock(rows);

    render(<Table block={block} />);
    expect(screen.getByText('1행1열')).toBeInTheDocument();
    expect(screen.getByText('2행2열')).toBeInTheDocument();
    expect(screen.getByText('3행1열')).toBeInTheDocument();
  });
});
