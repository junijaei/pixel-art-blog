import { ImageModal } from '@/components/ui/image-modal/ImageModal';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof ImageModal> = {
  title: 'UI/ImageModal',
  component: ImageModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    caption: {
      control: 'text',
      description: 'Optional caption below the image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageModal>;

// Interactive wrapper to demonstrate open/close behavior
function InteractiveDemo({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="border-border bg-background hover:bg-muted rounded-lg border p-4 transition-colors"
      >
        <img src={src} alt={alt} className="h-32 w-auto rounded" />
        <p className="text-muted-foreground mt-2 text-sm">Click to enlarge</p>
      </button>

      <ImageModal src={src} alt={alt} isOpen={isOpen} onClose={() => setIsOpen(false)} caption={caption} />
    </div>
  );
}

/**
 * Default image modal with a sample image
 */
export const Default: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Sample image',
    isOpen: true,
    onClose: () => {},
  },
};

/**
 * Modal with caption displayed below the image
 */
export const WithCaption: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Sample image with caption',
    isOpen: true,
    onClose: () => {},
    caption: 'This is a sample caption for the image',
  },
};

/**
 * Interactive demo - click image to open modal
 */
export const Interactive: Story = {
  render: () => (
    <InteractiveDemo
      src="https://picsum.photos/800/600"
      alt="Interactive demo image"
      caption="Click outside, press ESC, or click X to close"
    />
  ),
};

/**
 * Portrait orientation image
 */
export const PortraitImage: Story = {
  args: {
    src: 'https://picsum.photos/400/800',
    alt: 'Portrait orientation image',
    isOpen: true,
    onClose: () => {},
  },
};

/**
 * Wide panoramic image
 */
export const WideImage: Story = {
  args: {
    src: 'https://picsum.photos/1200/400',
    alt: 'Wide panoramic image',
    isOpen: true,
    onClose: () => {},
    caption: 'Panoramic landscape view',
  },
};
