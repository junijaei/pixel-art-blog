import type { Meta, StoryObj } from '@storybook/nextjs';
import { Code } from './Code';
import { createCodeBlock, createRichText } from '../__integration__/fixtures';

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
      createRichText('Example code implementation', { italic: true })
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
    block: createCodeBlock('<div className="container"><h1>Hello</h1></div>', 'jsx'),
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
