import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PixelDecoration } from '@/shared/ui/pixel/pixel-decoration';

const getCornerCells = (gradientStart?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
  render(
    <div data-testid="corner-decoration">
      {gradientStart ? (
        <PixelDecoration layout="corner" gradientStart={gradientStart} />
      ) : (
        <PixelDecoration layout="corner" />
      )}
    </div>
  );

  return Array.from(screen.getByTestId('corner-decoration').firstElementChild?.children ?? []);
};

describe('PixelDecoration', () => {
  it('keeps the existing top-left corner gradient by default', () => {
    const cells = getCornerCells();

    expect(cells[0]).toHaveClass('bg-muted-foreground/40');
    expect(cells[1]).toHaveClass('bg-muted-foreground/20');
    expect(cells[2]).toHaveClass('bg-muted-foreground/10');
    expect(cells[3]).toHaveClass('bg-muted-foreground/20');
    expect(cells[4]).toHaveClass('bg-muted-foreground/10');
    expect(cells[6]).toHaveClass('bg-muted-foreground/10');
  });

  it.each([
    ['top-left', 0],
    ['top-right', 2],
    ['bottom-left', 6],
    ['bottom-right', 8],
  ] as const)('places the strongest corner dot at %s', (gradientStart, strongestCellIndex) => {
    const cells = getCornerCells(gradientStart);

    expect(cells[strongestCellIndex]).toHaveClass('bg-muted-foreground/40');
  });
});
