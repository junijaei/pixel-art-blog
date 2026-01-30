import { TableOfContents, TocItem } from '@/components/ui/table-of-contents/TableOfContents';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof TableOfContents> = {
  title: 'UI/TableOfContents',
  component: TableOfContents,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-background relative min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

const sampleItems: TocItem[] = [
  { id: 'introduction', text: 'Introduction', level: 1 },
  { id: 'getting-started', text: 'Getting Started', level: 2 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'configuration', text: 'Configuration', level: 3 },
  { id: 'basic-usage', text: 'Basic Usage', level: 2 },
  { id: 'advanced-topics', text: 'Advanced Topics', level: 1 },
  { id: 'custom-hooks', text: 'Custom Hooks', level: 2 },
  { id: 'performance', text: 'Performance Optimization', level: 2 },
  { id: 'troubleshooting', text: 'Troubleshooting', level: 1 },
];

/**
 * Default TOC with multiple heading levels
 */
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

/**
 * TOC with an active item highlighted
 */
export const WithActiveItem: Story = {
  args: {
    items: sampleItems,
    activeId: 'basic-usage',
  },
};

/**
 * TOC with only level 1 headings
 */
export const FlatStructure: Story = {
  args: {
    items: [
      { id: 'intro', text: 'Introduction', level: 1 },
      { id: 'features', text: 'Features', level: 1 },
      { id: 'usage', text: 'Usage', level: 1 },
      { id: 'api', text: 'API Reference', level: 1 },
      { id: 'faq', text: 'FAQ', level: 1 },
    ],
  },
};

/**
 * Empty TOC (renders nothing)
 */
export const Empty: Story = {
  args: {
    items: [],
  },
};

/**
 * TOC with long titles that get truncated
 */
export const LongTitles: Story = {
  args: {
    items: [
      { id: 'intro', text: 'Introduction to the Project and Getting Started Guide', level: 1 },
      { id: 'install', text: 'Installation Instructions for Different Platforms', level: 2 },
      { id: 'config', text: 'Configuration Options and Environment Variables Setup', level: 2 },
      { id: 'advanced', text: 'Advanced Usage Patterns and Best Practices', level: 1 },
    ],
  },
};

/**
 * Interactive demo showing hierarchical collapse/expand behavior
 * Click buttons to simulate scrolling to different sections
 */
export const InteractiveDemo: Story = {
  render: function InteractiveDemoComponent() {
    const [activeId, setActiveId] = useState<string>('introduction');

    return (
      <div className="relative">
        {/* Section selector */}
        <div className="max-w-2xl space-y-4 p-8">
          <h3 className="mb-4 text-lg font-semibold">Click to simulate active section:</h3>
          <div className="flex flex-wrap gap-2">
            {sampleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  activeId === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>

          <div className="bg-muted/50 mt-8 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              <strong>Behavior:</strong> When a Level 1 heading is active, its child Level 2/3 items expand. Other
              sections collapse to show only their Level 1 heading.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Current active:</strong> <code className="bg-muted rounded px-1">{activeId}</code>
            </p>
          </div>
        </div>

        {/* TOC (normally positioned fixed, but inline for story) */}
        <div className="fixed top-1/4 right-8">
          <TableOfContents items={sampleItems} activeId={activeId} />
        </div>
      </div>
    );
  },
};

/**
 * Simple demo with scroll content
 */
export const ScrollDemo: Story = {
  render: () => {
    const items: TocItem[] = [
      { id: 'section-1', text: 'Section One', level: 1 },
      { id: 'section-1-1', text: 'Subsection 1.1', level: 2 },
      { id: 'section-1-2', text: 'Subsection 1.2', level: 2 },
      { id: 'section-2', text: 'Section Two', level: 1 },
      { id: 'section-2-1', text: 'Subsection 2.1', level: 2 },
      { id: 'section-3', text: 'Section Three', level: 1 },
    ];

    return (
      <div className="relative">
        {/* Content sections */}
        <div className="max-w-2xl space-y-96 p-8">
          {items.map((item) => (
            <section key={item.id} id={item.id} className="border-border rounded-lg border p-8">
              <h2 className="mb-4 text-2xl font-bold">{item.text}</h2>
              <p className="text-muted-foreground">
                Scroll through this content to see the TOC update. Each section has its own ID that the TOC links to.
              </p>
            </section>
          ))}
        </div>

        {/* TOC (normally positioned fixed, but inline for story) */}
        <div className="fixed top-1/4 right-8">
          <TableOfContents items={items} activeId="section-1" />
        </div>
      </div>
    );
  },
};
