export const demoPosts = [
  {
    slug: "pixel-art-renaissance",
    title: "The Pixel Art Renaissance in Modern Design",
    excerpt:
      "Exploring how pixel aesthetics have made a comeback in contemporary digital design, blending nostalgia with modern minimalism.",
    content: `
The pixel art aesthetic, once a necessity born from technical limitations, has evolved into a deliberate design choice that carries both nostalgic weight and contemporary appeal.

## Why Pixels Matter

In an era of ultra-high-definition displays and photorealistic graphics, the deliberate choice to use pixel art represents something deeper than mere aesthetics. It's a statement about intentionality in design.

### The Beauty of Constraints

When every pixel counts, designers must make conscious decisions about each element. This constraint breeds creativity:

- **Clarity over complexity**: Every element must serve a purpose
- **Rhythm in repetition**: Patterns emerge from limited palettes
- **Emotional resonance**: Nostalgia meets modern sensibility

## The Technical Foundation

Modern pixel art isn't about limitation—it's about choice. Today's designers have access to unlimited colors and resolutions, yet many choose the pixel aesthetic because it communicates something unique.

### Grid Systems in Design

The underlying grid of pixel art parallels the grid systems that form the backbone of modern web design. Both share:

1. Mathematical precision
2. Predictable spacing
3. Visual harmony

## Conclusion

As we continue to push the boundaries of what's possible in digital design, the pixel remains a powerful tool for those who understand its potential.
    `,
    date: "Jan 10, 2026",
    category: "Design",
    readTime: "5 min read",
  },
  {
    slug: "minimalism-digital-age",
    title: "Minimalism in the Digital Age",
    excerpt: "How the principles of minimalism translate to interface design and why less continues to be more.",
    content: `
Minimalism isn't about having less—it's about making room for more of what matters.

## The Core Principles

Digital minimalism extends beyond visual design into how we structure information and interaction.

### Visual Hierarchy

When elements compete for attention, nothing wins. Minimalist design creates clear paths:

- Primary actions stand alone
- Secondary information recedes
- White space guides the eye

## The Paradox of Choice

Research consistently shows that more options lead to less satisfaction. This applies directly to interface design.

### Reducing Cognitive Load

Every element on a screen demands mental processing:

1. Recognition takes energy
2. Decisions cause fatigue
3. Simplicity enables action

## Implementation

Moving toward minimalism requires courage—the courage to remove, to say no, to trust that less will indeed be more.
    `,
    date: "Jan 8, 2026",
    category: "Philosophy",
    readTime: "4 min read",
  },
  {
    slug: "monochrome-palette",
    title: "The Power of Monochrome Palettes",
    excerpt: "Why limiting your color palette can lead to more impactful and memorable designs.",
    content: `
Color is one of the most powerful tools in a designer's arsenal. Paradoxically, sometimes the most powerful choice is to use less of it.

## The Psychology of Monochrome

Monochromatic designs create a sense of sophistication and focus that's difficult to achieve with complex color schemes.

### Emotional Impact

Different approaches to monochrome evoke different feelings:

- **Pure black and white**: Drama, contrast, clarity
- **Warm grays**: Softness, approachability
- **Cool grays**: Professionalism, technology

## Technical Benefits

Beyond aesthetics, monochrome palettes offer practical advantages in digital design.

### Consistency at Scale

When you limit your palette:

1. Design systems become simpler
2. Accessibility is easier to achieve
3. Brand recognition strengthens

## Finding Your Gray

Not all grays are created equal. The temperature, saturation, and value of your chosen gray will define the entire feel of your design.
    `,
    date: "Jan 5, 2026",
    category: "Color Theory",
    readTime: "3 min read",
  },
  {
    slug: "grid-systems-web",
    title: "Grid Systems: The Foundation of Web Design",
    excerpt: "Understanding how mathematical grids create visual harmony and improve user experience.",
    content: `
Behind every well-designed website lies an invisible structure: the grid.

## History of the Grid

Grid systems predate digital design by centuries, finding their roots in book design and typography.

### From Print to Pixel

The transition from print to web brought new challenges:

- Responsive breakpoints
- Variable content
- Dynamic interaction

## Modern Grid Approaches

Today's designers have more tools than ever for implementing grids.

### CSS Grid and Flexbox

Modern CSS provides native support for complex layouts:

1. Two-dimensional control with Grid
2. One-dimensional flexibility with Flexbox
3. Combination approaches for complex interfaces

## Beyond the Basics

Understanding grids is just the beginning. Mastery comes from knowing when to break them.
    `,
    date: "Jan 3, 2026",
    category: "Development",
    readTime: "6 min read",
  },
  {
    slug: "typography-digital",
    title: "Typography in Digital Spaces",
    excerpt: "Selecting and pairing typefaces for screens while maintaining readability and personality.",
    content: `
Typography is the voice of design. In digital spaces, it must speak clearly across countless devices and contexts.

## Screen-First Type Selection

What works in print doesn't always work on screen.

### Key Considerations

When choosing typefaces for digital:

- X-height affects readability
- Weight distribution matters
- Rendering varies by device

## The Two-Font Rule

Most interfaces benefit from limiting typefaces to two or fewer.

### Establishing Hierarchy

A common approach:

1. Display font for headlines
2. Body font for content
3. Monospace for code (when needed)

## Variable Fonts

The future of digital typography lies in variable fonts, offering infinite possibilities within a single file.
    `,
    date: "Dec 28, 2025",
    category: "Typography",
    readTime: "4 min read",
  },
]

export function getPost(slug: string) {
  return demoPosts.find((post) => post.slug === slug)
}
