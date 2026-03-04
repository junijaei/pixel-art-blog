import { Image } from '@/components/notion-blocks/Image/Image';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { createImageBlock, createRichText } from '../__integration__/fixtures';

const meta = {
  title: 'Notion Blocks/Image',
  component: Image,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: createImageBlock('/placeholder-image.png', 'external', 'Example image'),
  },
};

export const WithCaption: Story = {
  args: {
    block: createImageBlock(
      '/placeholder-image.png',
      'external',
      'Image with caption',
      createRichText('This is a beautiful landscape photo taken during sunset.')
    ),
  },
};

export const WithStyledCaption: Story = {
  args: {
    block: createImageBlock('/placeholder-image.png', 'external', 'Image with styled caption', [
      ...createRichText('Photo by '),
      ...createRichText('John Doe', { bold: true }),
      ...createRichText(' - '),
      ...createRichText('View original', { link: 'https://example.com' }),
    ]),
  },
};

export const FromNotionFile: Story = {
  args: {
    block: createImageBlock('/placeholder-image.png', 'file', 'Notion uploaded image'),
  },
};

export const WithoutAltText: Story = {
  args: {
    block: createImageBlock('/placeholder-image.png', 'external'),
  },
};

export const MultipleImages: Story = {
  args: {
    block: createImageBlock('/placeholder-image.png', 'external', 'Multiple images demo'),
  },
  render: () => (
    <div>
      <Image
        block={createImageBlock(
          '/placeholder-image.png',
          'external',
          'First image',
          createRichText('First image caption')
        )}
      />
      <Image
        block={createImageBlock(
          '/placeholder-image.png',
          'external',
          'Second image',
          createRichText('Second image caption')
        )}
      />
      <Image block={createImageBlock('/placeholder-image.png', 'external', 'Third image')} />
    </div>
  ),
}
