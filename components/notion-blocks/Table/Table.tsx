import { RichText } from '@/components/notion-blocks/RichText/RichText';
import type { TableBlock, TableRowBlock } from '@/types/notion';
import { cn } from '@/utils/utils';

export interface TableProps {
  block: TableBlock;
}

/**
 * Notion Table 블록을 렌더링하는 컴포넌트
 *
 * TableBlock의 children으로 TableRowBlock 배열을 받아서
 * has_column_header, has_row_header 설정에 따라 thead/tbody와 th/td를 구분 렌더링합니다.
 *
 * @param block - Notion API에서 반환된 Table 블록 데이터 (children에 TableRowBlock 포함)
 */
export function Table({ block }: TableProps) {
  const { has_column_header, has_row_header } = block.table;
  const rows = (block.children ?? []) as TableRowBlock[];

  if (rows.length === 0) return null;

  const headerRow = has_column_header ? rows[0] : null;
  const bodyRows = has_column_header ? rows.slice(1) : rows;

  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        {headerRow && (
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headerRow.table_row.cells.map((cell, cellIndex) => (
                <th
                  key={cellIndex}
                  scope="col"
                  className={cn(
                    'px-4 py-2.5 text-left font-semibold text-foreground',
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
              className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
            >
              {row.table_row.cells.map((cell, cellIndex) => {
                const isRowHeader = has_row_header && cellIndex === 0;
                if (isRowHeader) {
                  return (
                    <th
                      key={cellIndex}
                      scope="row"
                      className="bg-muted/50 px-4 py-2.5 text-left font-semibold text-foreground"
                    >
                      <RichText richTextArray={cell} />
                    </th>
                  );
                }
                return (
                  <td key={cellIndex} className="px-4 py-2.5 text-left text-foreground">
                    <RichText richTextArray={cell} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
