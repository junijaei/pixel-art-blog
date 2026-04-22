import { RichText } from '@/components/notion-blocks/RichText/RichText';
import type { TableBlock, TableRowBlock } from '@/types/notion';
import { cn } from '@/utils/utils';
import type { ReactNode } from 'react';
import { ChildBlockContainer } from '../ChildBlockContainer';

export interface TableProps {
  block: TableBlock;
  children?: ReactNode;
}

/**
 * Notion Table 블록을 렌더링하는 컴포넌트
 *
 * TableBlock의 children으로 TableRowBlock 배열을 받아서
 * has_column_header, has_row_header 설정에 따라 thead/tbody와 th/td를 구분 렌더링합니다.
 *
 * @param block - Notion API에서 반환된 Table 블록 데이터 (children에 TableRowBlock 포함)
 */
export function Table({ block, children }: TableProps) {
  const { has_column_header, has_row_header } = block.table;
  const rows = (block.children ?? []) as TableRowBlock[];

  if (rows.length === 0) {
    return children ? <ChildBlockContainer>{children}</ChildBlockContainer> : null;
  }

  const headerRow = has_column_header ? rows[0] : null;
  const bodyRows = has_column_header ? rows.slice(1) : rows;

  return (
    <>
      <div className="border-border my-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          {headerRow && (
            <thead>
              <tr className="border-border bg-muted/50 border-b">
                {headerRow.table_row.cells.map((cell, cellIndex) => (
                  <th
                    key={cellIndex}
                    scope="col"
                    className={cn(
                      'text-foreground px-4 py-2.5 text-left font-semibold',
                      has_row_header && cellIndex === 0 && 'bg-muted/80'
                    )}
                  >
                    <RichText richTextArray={cell} />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-border hover:bg-muted/30 border-b transition-colors last:border-0"
              >
                {row.table_row.cells.map((cell, cellIndex) => {
                  const isRowHeader = has_row_header && cellIndex === 0;
                  if (isRowHeader) {
                    return (
                      <th
                        key={cellIndex}
                        scope="row"
                        className="bg-muted/50 text-foreground px-4 py-2.5 text-left font-semibold"
                      >
                        <RichText richTextArray={cell} />
                      </th>
                    );
                  }
                  return (
                    <td key={cellIndex} className="text-foreground px-4 py-2.5 text-left">
                      <RichText richTextArray={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {children && <ChildBlockContainer>{children}</ChildBlockContainer>}
    </>
  );
}
