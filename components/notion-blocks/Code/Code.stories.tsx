import type { RichText, CodeBlock } from '@/types/notion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Code } from './Code';

const meta = {
  title: 'Notion Blocks/Code',
  component: Code,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

const createRichText = (content: string): RichText[] => [
  {
    type: 'text',
    text: {
      content,
      link: null,
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    },
    plain_text: content,
    href: null,
  },
];

const createCodeBlock = (code: string, language: string, caption: RichText[] = []): CodeBlock => ({
  object: 'block',
  id: 'code-block-1',
  type: 'code',
  created_time: '2026-01-14T00:00:00.000Z',
  last_edited_time: '2026-01-14T00:00:00.000Z',
  created_by: { object: 'user', id: 'user-1' },
  last_edited_by: { object: 'user', id: 'user-1' },
  has_children: false,
  archived: false,
  in_trash: false,
  parent: { type: 'page_id', page_id: 'page-1' },
  code: {
    rich_text: createRichText(code),
    language,
    caption,
  },
});

export const JavaScript: Story = {
  args: {
    block: createCodeBlock(
      `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      'javascript'
    ),
  },
};

export const Python: Story = {
  args: {
    block: createCodeBlock(
      `def hello_world():
    print("Hello, World!")

if __name__ == "__main__":
    hello_world()`,
      'python'
    ),
  },
};

export const WithCaption: Story = {
  args: {
    block: createCodeBlock(
      `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      'javascript',
      [
        {
          type: 'text',
          text: { content: 'Example code implementation', link: null },
          annotations: {
            bold: false,
            italic: true,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          plain_text: 'Example code implementation',
          href: null,
        },
      ]
    ),
  },
};

export const PlainText: Story = {
  args: {
    block: createCodeBlock('This is plain text code without syntax highlighting', 'plain text'),
  },
};

export const TypeScript: Story = {
  args: {
    block: createCodeBlock(
      `interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];`,
      'typescript'
    ),
  },
};

export const JSX: Story = {
  args: {
    block: createCodeBlock(
      `<div className="container">
  <h1>Hello</h1>
  <p>This is JSX</p>
</div>`,
      'jsx'
    ),
  },
};

export const SQL: Story = {
  args: {
    block: createCodeBlock('SELECT * FROM users WHERE age > 18;', 'sql'),
  },
};

export const Bash: Story = {
  args: {
    block: createCodeBlock(
      `git commit -m "Initial commit"
git push origin main`,
      'bash'
    ),
  },
};

export const LongCode: Story = {
  args: {
    block: createCodeBlock(
      `const veryLongLineOfCodeThatExceedsTheNormalWidthOfACodeBlock = "This demonstrates horizontal scrolling";

function complexFunction(param1, param2, param3, param4, param5) {
  const result = param1 + param2 + param3 + param4 + param5;
  return result;
}

// More code...
const anotherVeryLongVariableNameThatDemonstratesHorizontalScrolling = true;`,
      'typescript'
    ),
  },
};

export const MultipleCodeBlocks: Story = {
  args: {
    block: createCodeBlock('', 'javascript'), // Required by type but not used
  },
  render: () => (
    <div className="space-y-6">
      <Code
        block={createCodeBlock(
          `<div className="container">
  <h1>Hello</h1>
</div>`,
          'jsx'
        )}
      />
      <Code block={createCodeBlock('SELECT * FROM users WHERE age > 18;', 'sql')} />
      <Code
        block={createCodeBlock(
          `git commit -m "Initial commit"
git push origin main`,
          'bash'
        )}
      />
    </div>
  ),
};
