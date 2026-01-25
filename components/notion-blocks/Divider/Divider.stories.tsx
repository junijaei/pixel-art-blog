import { Divider } from '@/components/notion-blocks/Divider/Divider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
  title: 'Notion Blocks/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const BetweenContent: Story = {
  render: () => (
    <div className="space-y-4">
      <p>This is some content above the divider. It could be a paragraph, heading, or any other block element.</p>
      <Divider />
      <p>This is content below the divider. The divider helps visually separate different sections of content.</p>
    </div>
  ),
};

export const MultipleDividers: Story = {
  render: () => (
    <div>
      <h2 className="mb-2 text-xl font-bold">Section 1</h2>
      <p className="mb-4">Content for the first section.</p>
      <Divider />

      <h2 className="mb-2 text-xl font-bold">Section 2</h2>
      <p className="mb-4">Content for the second section.</p>
      <Divider />

      <h2 className="mb-2 text-xl font-bold">Section 3</h2>
      <p>Content for the third section.</p>
    </div>
  ),
};

export const WithCustomSpacing: Story = {
  render: () => (
    <div>
      <p>Content with default spacing</p>
      <Divider />
      <p>Content with default spacing</p>
      <Divider className="my-12" />
      <p>Content with larger spacing (my-12)</p>
      <Divider className="my-2" />
      <p>Content with smaller spacing (my-2)</p>
    </div>
  ),
};

export const InArticle: Story = {
  render: () => (
    <article className="prose max-w-2xl">
      <h1>Article Title</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </p>

      <Divider />

      <h2>First Section</h2>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

      <Divider />

      <h2>Second Section</h2>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

      <Divider />

      <h2>Conclusion</h2>
      <p>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </article>
  ),
};

export const WithCallout: Story = {
  render: () => (
    <div>
      <p>Regular paragraph content goes here.</p>

      <Divider />

      <div className="bg-accent/20 border-accent/40 my-4 rounded-xl border p-4">
        <p className="mb-2 font-bold">💡 Important Note</p>
        <p>This is a callout box that stands out from the rest of the content. Dividers help separate it visually.</p>
      </div>

      <Divider />

      <p>More regular content continues after the callout.</p>
    </div>
  ),
};
