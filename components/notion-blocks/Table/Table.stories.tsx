import { Table } from '@/components/notion-blocks/Table/Table';
import {
  createTableBlock,
  createTableRowBlock,
} from '@/components/notion-blocks/__integration__/fixtures';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Notion Blocks/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: createTableBlock([
      createTableRowBlock(['이름', '역할', '부서']),
      createTableRowBlock(['Alice', '개발자', '엔지니어링']),
      createTableRowBlock(['Bob', '디자이너', '프로덕트']),
      createTableRowBlock(['Charlie', '기획자', '프로덕트']),
    ]),
  },
};

export const WithColumnHeader: Story = {
  args: {
    block: createTableBlock(
      [
        createTableRowBlock(['이름', '역할', '부서']),
        createTableRowBlock(['Alice', '개발자', '엔지니어링']),
        createTableRowBlock(['Bob', '디자이너', '프로덕트']),
        createTableRowBlock(['Charlie', '기획자', '프로덕트']),
      ],
      { has_column_header: true }
    ),
  },
};

export const WithRowHeader: Story = {
  args: {
    block: createTableBlock(
      [
        createTableRowBlock(['항목', '1월', '2월', '3월']),
        createTableRowBlock(['매출', '100만', '120만', '150만']),
        createTableRowBlock(['비용', '50만', '60만', '70만']),
        createTableRowBlock(['순이익', '50만', '60만', '80만']),
      ],
      { has_row_header: true }
    ),
  },
};

export const WithColumnAndRowHeader: Story = {
  args: {
    block: createTableBlock(
      [
        createTableRowBlock(['', '1월', '2월', '3월']),
        createTableRowBlock(['매출', '100만', '120만', '150만']),
        createTableRowBlock(['비용', '50만', '60만', '70만']),
        createTableRowBlock(['순이익', '50만', '60만', '80만']),
      ],
      { has_column_header: true, has_row_header: true }
    ),
  },
};

export const SingleColumn: Story = {
  args: {
    block: createTableBlock(
      [
        createTableRowBlock(['항목']),
        createTableRowBlock(['첫 번째']),
        createTableRowBlock(['두 번째']),
        createTableRowBlock(['세 번째']),
      ],
      { has_column_header: true }
    ),
  },
};

export const Empty: Story = {
  args: {
    block: createTableBlock([]),
  },
  render: () => (
    <p className="text-muted-foreground text-sm">빈 테이블은 아무것도 렌더링하지 않습니다.</p>
  ),
};
