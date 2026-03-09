import { ImageModal } from '@/components/ui/image-modal/ImageModal';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ImageModal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image',
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Rendering', () => {
    it('renders nothing when isOpen is false', () => {
      render(<ImageModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders modal when isOpen is true', () => {
      render(<ImageModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders image with correct src and alt', () => {
      render(<ImageModal {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', defaultProps.src);
      expect(img).toHaveAttribute('alt', defaultProps.alt);
    });

    it('renders close button', () => {
      render(<ImageModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /닫기/i })).toBeInTheDocument();
    });

    it('renders caption when provided', () => {
      render(<ImageModal {...defaultProps} caption="This is a caption" />);
      expect(screen.getByText('This is a caption')).toBeInTheDocument();
    });

    it('does not render caption when not provided', () => {
      render(<ImageModal {...defaultProps} />);
      expect(screen.queryByText('This is a caption')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      render(<ImageModal {...defaultProps} />);
      const closeButton = screen.getByRole('button', { name: /닫기/i });
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      render(<ImageModal {...defaultProps} />);
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when image is clicked', () => {
      render(<ImageModal {...defaultProps} />);
      const img = screen.getByRole('img');
      fireEvent.click(img);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      render(<ImageModal {...defaultProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has appropriate aria attributes', () => {
      render(<ImageModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label');
    });

    it('close button has accessible name', () => {
      render(<ImageModal {...defaultProps} />);
      const closeButton = screen.getByRole('button', { name: /닫기/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
