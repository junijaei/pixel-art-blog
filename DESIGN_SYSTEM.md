# Pixel/Dot Monochrome Blog Design System

A comprehensive design system documentation for creating modern, minimalist interfaces with pixel/dot retro aesthetic elements while maintaining contemporary UX principles.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Decorative Elements](#decorative-elements)
7. [Icons](#icons)
8. [Motion & Interactions](#motion--interactions)
9. [Implementation Guidelines](#implementation-guidelines)
10. [Code Examples](#code-examples)

---

## Design Philosophy

### Core Principles

```
RETRO_MODERN_FUSION:
  - Pixel/dot aesthetics as ACCENT elements only
  - Modern layout and UX as PRIMARY foundation
  - Never compromise readability for style
  - Minimalism over decoration
  - Functional beauty over ornamental complexity
```

### Visual Balance Formula

```
VISUAL_HIERARCHY:
  pixel_elements: 15-20% of visual weight
  modern_elements: 80-85% of visual weight
  
USAGE_GUIDELINES:
  - Use pixel fonts for: labels, badges, navigation items, small headings
  - Use modern fonts for: body text, main headings, paragraphs
  - Use dot decorations for: dividers, corner accents, visual rhythm
  - Never use pixel fonts for: long-form content, articles, descriptions
```

---

## Color System

### Achromatic Palette (Zero Chroma)

```css
/* CRITICAL: Use neutral/zinc-based grays without blue tint */
/* All colors use oklch() with chroma = 0 for pure achromatic values */

:root {
  /* Background layers */
  --background: oklch(0.985 0 0);     /* Near white, main canvas */
  --card: oklch(1 0 0);               /* Pure white, elevated surfaces */
  --secondary: oklch(0.96 0 0);       /* Subtle gray, hover states */
  --muted: oklch(0.96 0 0);           /* Same as secondary */
  --accent: oklch(0.92 0 0);          /* Slightly darker, emphasis areas */
  
  /* Foreground colors */
  --foreground: oklch(0.145 0 0);     /* Near black, primary text */
  --muted-foreground: oklch(0.48 0 0); /* Medium gray, secondary text */
  
  /* Borders & Inputs */
  --border: oklch(0.9 0 0);           /* Light gray borders */
  --input: oklch(0.9 0 0);            /* Input backgrounds */
  --ring: oklch(0.708 0 0);           /* Focus rings */
}

.dark {
  --background: oklch(0.145 0 0);     /* Near black */
  --card: oklch(0.205 0 0);           /* Slightly lighter */
  --secondary: oklch(0.27 0 0);       /* Dark gray */
  --foreground: oklch(0.985 0 0);     /* Near white */
  --muted-foreground: oklch(0.708 0 0); /* Light gray */
  --border: oklch(0.27 0 0);          /* Dark borders */
}
```

### Color Usage Rules

```
HIERARCHY:
  1. --foreground: Primary text, important icons, active states
  2. --muted-foreground: Secondary text, inactive icons, metadata
  3. --background: Page background
  4. --card: Elevated surfaces (cards, modals, dropdowns)
  5. --border: Dividers, card borders, separators
  6. --accent: Hover backgrounds, subtle highlights

OPACITY_PATTERNS:
  - muted-foreground/60: Decorative dots (medium emphasis)
  - muted-foreground/40: Decorative dots (low emphasis)
  - muted-foreground/30: Decorative dots (minimal emphasis)
  - muted-foreground/20: Subtle backgrounds, faint dots
  - muted-foreground/10: Near-invisible decorative elements
```

---

## Typography

### Font Stack

```css
@theme inline {
  --font-sans: "Geist", "Geist Fallback", sans-serif;     /* Primary: body, headings */
  --font-mono: "Geist Mono", "Geist Mono Fallback", monospace;  /* Code blocks */
  --font-pixel: "Silkscreen", cursive;                     /* Accent: labels, badges */
}
```

### Font Loading (Next.js)

```tsx
import { Geist, Geist_Mono, Silkscreen } from "next/font/google"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
})

// Apply in body className:
// `${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} font-sans antialiased`
```

### Pixel Font Application

```tsx
/* Tailwind CSS v4 pattern for pixel font */
className="font-[family-name:var(--font-silkscreen)]"

/* SIZE GUIDELINES for pixel font */
text-[10px]: Labels, badges, tiny captions
text-xs:     Navigation items, metadata
text-sm:     Section headers, card titles

/* TRACKING (letter-spacing) */
tracking-wider:   Standard pixel text
tracking-widest:  Emphasized labels
```

### Typography Scale

```
BODY_TEXT:
  - Base: text-base (16px), leading-relaxed (1.625)
  - Small: text-sm (14px), leading-relaxed
  - Large: text-lg (18px), leading-relaxed

HEADINGS:
  - Hero: text-4xl sm:text-5xl lg:text-6xl, font-bold, leading-tight
  - Section: text-2xl sm:text-3xl, font-semibold
  - Card Title: text-lg sm:text-xl, font-medium
  - Subsection: text-xs tracking-wider, font-[pixel]

LINE_HEIGHT:
  - Headings: leading-tight (1.25)
  - Body: leading-relaxed (1.625)
  - Labels: leading-none or leading-tight
```

---

## Spacing & Layout

### Spacing Scale

```
CONTAINER_WIDTHS:
  max-w-6xl: Main content container (72rem / 1152px)
  max-w-2xl: Article/reading content (42rem / 672px) - CENTERED READING
  max-w-xl:  Narrow content, descriptions (36rem / 576px)

HORIZONTAL_PADDING:
  px-6: Standard page padding (24px)
  px-8: Featured cards internal padding (32px)
  
VERTICAL_SPACING:
  py-4:  Header/navigation (16px)
  py-12: Footer sections (48px)
  py-16: Main content sections (64px)
  py-20: Hero sections (80px)

GAP_PATTERNS:
  gap-1:   Tight dot patterns (4px)
  gap-1.5: Standard dot decorations (6px)
  gap-2:   Icon + text pairs (8px)
  gap-3:   Small component spacing (12px)
  gap-4:   Standard component spacing (16px)
  gap-6:   Card grid spacing (24px)
```

### Layout Patterns

```tsx
/* CENTERED READING LAYOUT - Article pages */
<main className="flex-1 py-16 px-6">
  <div className="max-w-2xl mx-auto">
    {/* Article content */}
  </div>
</main>

/* WIDE CONTENT LAYOUT - Home, listing pages */
<section className="px-6">
  <div className="max-w-6xl mx-auto">
    {/* Cards, grids, etc. */}
  </div>
</section>

/* RESPONSIVE GRID */
<div className="grid sm:grid-cols-2 gap-6">
  {/* Cards */}
</div>
```

### Border Radius

```
RADIUS_SCALE:
  --radius: 0.625rem (10px) - Base value
  
USAGE:
  rounded-lg:  Cards, large containers (var(--radius))
  rounded-xl:  Featured cards, hero elements (var(--radius) + 4px)
  rounded-md:  Buttons, badges (var(--radius) - 2px)
  rounded-full: Dots only (50%)

RULE: Never use rounded-none (0). Always maintain slight rounding for modern feel.
```

---

## Components

### Card Component

```tsx
interface CardProps {
  featured?: boolean
}

/* Standard Card */
<div className="
  bg-card 
  border border-border 
  rounded-xl 
  p-6 
  hover:border-muted-foreground/30 
  transition-all duration-300
">

/* Featured Card */
<div className="
  relative
  bg-card 
  border border-border 
  rounded-xl 
  p-8 
  hover:border-muted-foreground/30 
  transition-all duration-300
">
  <DotDecoration variant="corner" className="absolute top-4 right-4 opacity-50" />
```

### Badge Component

```tsx
/* Primary Badge (pixel font) */
<span className="
  text-[10px] 
  px-3 py-1.5 
  bg-foreground text-background 
  rounded-md 
  tracking-wider 
  font-[family-name:var(--font-silkscreen)]
">
  FEATURED
</span>

/* Secondary Badge */
<span className="
  text-xs 
  px-2 py-1 
  bg-secondary text-secondary-foreground 
  rounded-md
">
  Category
</span>
```

### Navigation Item

```tsx
<Link className="
  flex items-center gap-2 
  text-sm text-muted-foreground 
  hover:text-foreground 
  transition-colors
">
  <PixelIcon className="w-4 h-4" />
  <span className="hidden sm:inline">Label</span>
</Link>
```

### Header Structure

```tsx
<header className="
  border-b border-border 
  bg-card/50 backdrop-blur-sm 
  sticky top-0 z-50
">
  <div className="max-w-6xl mx-auto px-6 py-4">
    <nav className="flex items-center justify-between">
      {/* Logo with dots */}
      {/* Navigation links */}
    </nav>
  </div>
</header>
```

---

## Decorative Elements

### Dot Decoration Variants

```tsx
/* HORIZONTAL - Dividers, section separators */
variant="horizontal"
<div className="flex gap-1.5 items-center">
  {[...Array(5)].map((_, i) => (
    <div className={cn(
      "w-1.5 h-1.5 rounded-full bg-muted-foreground/30",
      i === 2 && "bg-muted-foreground/60"  // Center dot emphasized
    )} />
  ))}
</div>

/* VERTICAL - Side decorations */
variant="vertical"
// Same as horizontal but flex-col

/* CORNER - Card accents */
variant="corner"
<div className="grid grid-cols-3 gap-1">
  {/* 9 dots with decreasing opacity from top-left */}
  {/* Pattern: 40%, 20%, 10% / 20%, 10%, 0% / 10%, 0%, 0% */}
</div>

/* GRID - Background patterns */
variant="grid"
<div className="grid grid-cols-4 gap-2">
  {/* Fixed pattern array to avoid hydration errors */}
  {[1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0].map((val, i) => (
    <div className={cn(
      "w-1 h-1 rounded-full",
      val ? "bg-muted-foreground/40" : "bg-muted-foreground/20"
    )} />
  ))}
</div>
```

### Dot Size Guidelines

```
SIZES:
  w-1 h-1:     Grid patterns, subtle backgrounds (4px)
  w-1.5 h-1.5: Standard decorative dots (6px)
  w-2 h-2:     Logo dots, emphasis elements (8px)

OPACITY_HIERARCHY:
  Full color (text-foreground): Active/primary state
  /60: Medium emphasis, secondary importance
  /40: Standard decorative
  /30: Subtle, background decoration
  /20: Very subtle, pattern fills
  /10: Near-invisible, gradient fade
```

### Decorative Divider Pattern

```tsx
/* Centered dot divider */
<div className="flex items-center gap-3">
  <div className="flex-1 h-px bg-border" />
  <div className="flex gap-1.5">
    {[...Array(5)].map((_, i) => (
      <PixelDot 
        className={`w-1.5 h-1.5 ${
          i === 2 ? "text-foreground" : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
  <div className="flex-1 h-px bg-border" />
</div>
```

---

## Icons

### Pixel Icon Construction

```tsx
/* Base structure for 16x16 pixel icons */
<svg viewBox="0 0 16 16" fill="currentColor" className={className}>
  {/* Use 2x2 rect elements for pixels */}
  <rect x="7" y="1" width="2" height="2" />
  {/* Build recognizable shapes with minimal pixels */}
</svg>

/* Smaller dot icon (8x8) */
<svg viewBox="0 0 8 8" fill="currentColor" className={className}>
  <rect x="2" y="2" width="4" height="4" />
</svg>
```

### Icon Set (Required)

```
NAVIGATION:
  PixelHome   - House shape, navigation home
  PixelFile   - Document with lines, posts/articles
  PixelUser   - Person silhouette, about/profile
  PixelSearch - Magnifying glass, search function
  PixelMenu   - Three horizontal lines, mobile menu

CONTENT:
  PixelClock  - Clock face, timestamps/dates
  PixelTag    - Tag shape, categories/labels
  PixelArrow  - Right-pointing arrow, links/navigation
  PixelDot    - Simple square dot, decorations/bullets
```

### Icon Sizing

```
SIZES:
  w-2 h-2:   Logo dots, inline decorations
  w-2.5 h-2.5: Small metadata icons
  w-3 h-3:   Card metadata, small labels
  w-4 h-4:   Navigation icons, standard buttons
  
ALWAYS use currentColor for fill to inherit text color
```

---

## Motion & Interactions

### Transition Patterns

```css
/* Standard state transitions */
transition-colors           /* Color changes only */
transition-all duration-300 /* Complex state changes */
transition-transform        /* Position/scale changes */

/* Hover interactions */
hover:text-foreground       /* Text color lift */
hover:text-muted-foreground /* Text color dim */
hover:border-muted-foreground/30  /* Border emphasis */
hover:bg-secondary          /* Background highlight */
```

### Micro-interactions

```tsx
/* Arrow slide on hover */
<div className="group">
  <PixelArrow className="group-hover:translate-x-0.5 transition-transform" />
</div>

/* Gap expansion on hover */
<div className="flex items-center gap-2 group-hover:gap-3 transition-all">
  <span>Read</span>
  <PixelArrow />
</div>

/* Back arrow (reversed) */
<PixelArrow className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
```

---

## Implementation Guidelines

### File Structure

```
/app
  /globals.css        # Theme tokens, base styles
  /layout.tsx         # Font loading, body setup
  /page.tsx           # Home page
  /posts/
    /page.tsx         # Posts listing
    /[slug]/page.tsx  # Post detail (centered layout)
  /about/page.tsx     # About page

/components
  /pixel-icons.tsx    # All SVG pixel icons
  /dot-decoration.tsx # Decorative dot patterns
  /blog-header.tsx    # Navigation header
  /blog-footer.tsx    # Page footer
  /post-card.tsx      # Blog post cards

/lib
  /demo-posts.ts      # Demo content data
  /utils.ts           # cn() helper function
```

### Critical Rules

```
1. HYDRATION_SAFETY:
   - Never use Math.random() in render
   - Use fixed pattern arrays for decorations
   - Avoid client-side only calculations

2. FONT_APPLICATION:
   - Use font-[family-name:var(--font-silkscreen)] not inline style
   - Never use pixel font for body text
   - Always load fonts via next/font/google

3. COLOR_PURITY:
   - Always use oklch with chroma=0 for grays
   - Avoid blue-tinted grays (slate, gray with hue)
   - Use neutral/zinc equivalents only

4. READABILITY_FIRST:
   - Pixel elements are accents, not primary
   - Maintain minimum contrast ratios
   - Use leading-relaxed for body text

5. RESPONSIVE:
   - Mobile-first approach
   - Hide text labels on small screens (icons remain)
   - Use sm: and lg: breakpoints for progressive enhancement
```

### Accessibility

```
- All icons need accompanying text or aria-label
- Maintain WCAG contrast ratios (4.5:1 for text)
- Use semantic HTML (header, main, article, footer, nav)
- Pixel fonts only for decorative text, not essential content
- Focus states must be visible (ring token)
```

---

## Code Examples

### Complete Card Implementation

```tsx
import Link from "next/link"
import { PixelFile, PixelClock, PixelTag, PixelArrow } from "./pixel-icons"
import { DotDecoration } from "./dot-decoration"

interface PostCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    date: string
    category: string
    readTime: string
  }
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block relative bg-card border border-border rounded-xl p-8 hover:border-muted-foreground/30 transition-all duration-300"
      >
        <DotDecoration variant="corner" className="absolute top-4 right-4 opacity-50" />

        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] px-3 py-1.5 bg-foreground text-background rounded-md tracking-wider font-[family-name:var(--font-silkscreen)]">
            FEATURED
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PixelTag className="w-3 h-3" />
            <span className="text-xs">{post.category}</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3 group-hover:text-muted-foreground transition-colors leading-relaxed">
          {post.title}
        </h2>

        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <PixelClock className="w-3 h-3" />
              <span>{post.date}</span>
            </div>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Read</span>
            <PixelArrow className="w-4 h-4" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block bg-card border border-border rounded-xl p-6 hover:border-muted-foreground/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <PixelFile className="w-3 h-3" />
          <span className="text-xs">{post.category}</span>
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2 group-hover:text-muted-foreground transition-colors leading-relaxed">
        {post.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <PixelClock className="w-2.5 h-2.5" />
          <span>{post.date}</span>
        </div>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
    </Link>
  )
}
```

### Hero Section Pattern

```tsx
<section className="py-20 px-6">
  <div className="max-w-6xl mx-auto">
    {/* Decorative intro */}
    <div className="flex items-center gap-4 mb-6">
      <DotDecoration variant="horizontal" />
      <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-[family-name:var(--font-silkscreen)]">
        Personal Blog
      </span>
    </div>

    {/* Main headline - Modern font */}
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
      Thoughts on design,
      <br />
      <span className="text-muted-foreground">pixels & minimalism</span>
    </h1>

    {/* Description - Readable font */}
    <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
      Exploring the intersection of pixel aesthetics and modern design principles.
    </p>

    {/* Decorative dots */}
    <div className="flex items-center gap-2">
      {[...Array(8)].map((_, i) => (
        <PixelDot 
          key={i} 
          className={`w-2 h-2 ${i < 3 ? "text-foreground" : "text-muted-foreground/30"}`} 
        />
      ))}
    </div>
  </div>
</section>
```

---

## Summary

This design system creates a harmonious blend of retro pixel aesthetics with modern web design:

| Element | Retro/Pixel | Modern |
|---------|-------------|--------|
| Fonts | Labels, badges, tiny headings | Body text, main headings, articles |
| Icons | Custom 16x16 SVG pixel icons | - |
| Decorations | Dot patterns, grid accents | Clean borders, subtle shadows |
| Colors | - | Pure achromatic oklch palette |
| Layout | - | Flexbox, responsive grids, max-width containers |
| Interactions | - | Smooth transitions, micro-animations |

**Key Principle**: Pixel/dot elements provide character and nostalgia; modern design provides usability and readability.
