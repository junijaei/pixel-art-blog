import type { Meta, StoryObj } from '@storybook/react';
import { Code } from './Code';
import type { RichTextItem } from '@/types/notion';

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

const javascriptCode: RichTextItem[] = [
  {
    type: 'text',
    text: {
      content: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
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
    plain_text: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  },
];

const pythonCode: RichTextItem[] = [
  {
    type: 'text',
    text: {
      content: `def hello_world():
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()`,
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
    plain_text: `def hello_world():
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()`,
  },
];

const sampleCaption: RichTextItem[] = [
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
  },
];

export const JavaScript: Story = {
  args: {
    richText: javascriptCode,
    language: 'javascript',
  },
};

export const Python: Story = {
  args: {
    richText: pythonCode,
    language: 'python',
  },
};

export const WithCaption: Story = {
  args: {
    richText: javascriptCode,
    language: 'javascript',
    caption: sampleCaption,
  },
};

export const PlainText: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: { content: 'This is plain text code without syntax highlighting', link: null },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'default',
        },
        plain_text: 'This is plain text code without syntax highlighting',
      },
    ],
    language: 'plain text',
  },
};

export const MultipleLanguages: Story = {
  render: () => (
    <div className="space-y-6">
      <Code
        richText={[
          {
            type: 'text',
            text: { content: '<div className="container">\n  <h1>Hello</h1>\n</div>', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '<div className="container">\n  <h1>Hello</h1>\n</div>',
          },
        ]}
        language="jsx"
      />
      <Code
        richText={[
          {
            type: 'text',
            text: { content: 'SELECT * FROM users WHERE age > 18;', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'SELECT * FROM users WHERE age > 18;',
          },
        ]}
        language="sql"
      />
      <Code
        richText={[
          {
            type: 'text',
            text: { content: 'git commit -m "Initial commit"\ngit push origin main', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'git commit -m "Initial commit"\ngit push origin main',
          },
        ]}
        language="bash"
      />
    </div>
  ),
};

export const LongCode: Story = {
  args: {
    richText: [
      {
        type: 'text',
        text: {
          content: `const veryLongLineOfCodeThatExceedsTheNormalWidthOfACodeBlock = "This demonstrates horizontal scrolling";

function complexFunction(param1, param2, param3, param4, param5) {
  const result = param1 + param2 + param3 + param4 + param5;
  return result;
}

// More code...
const anotherVeryLongVariableNameThatDemonstratesHorizontalScrolling = true;`,
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
        plain_text: `const veryLongLineOfCodeThatExceedsTheNormalWidthOfACodeBlock = "This demonstrates horizontal scrolling";

function complexFunction(param1, param2, param3, param4, param5) {
  const result = param1 + param2 + param3 + param4 + param5;
  return result;
}

// More code...
const anotherVeryLongVariableNameThatDemonstratesHorizontalScrolling = true;`,
      },
    ],
    language: 'typescript',
  },
};
