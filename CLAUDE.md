# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
ALWAYS RESPOND IN KOREAN

## Project Overview

This is a personal blog project that combines modern design with retro pixel aesthetics. The project is built with Next.js 16 and is designed to eventually use Notion as a CMS while maintaining full control over rendering and styling.

**Key Goals:**
- Zero maintenance cost (free hosting on Vercel)
- SEO-friendly static/ISR pages
- Simple content management through Notion (planned)
- Custom design with pixel/dot aesthetic accents
- Full control over block rendering (no markdown conversion)

## Development Commands

```bash
# Development
pnpm dev                 # Start Next.js dev server (port 3000)

# Building & Running
pnpm build              # Build for production
pnpm start              # Run production build locally

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Auto-fix ESLint errors
pnpm format             # Format with Prettier
pnpm format:check       # Check Prettier formatting

# Testing
pnpm test               # Run Vitest tests
pnpm test:ui            # Run tests with UI
pnpm test:coverage      # Generate coverage report

# Storybook
pnpm storybook          # Start Storybook dev server (port 6006)
pnpm build-storybook    # Build Storybook for production
```

## Architecture

### Design Philosophy

This project follows a **"retro-modern fusion"** approach where:
- Pixel/dot elements are **accent features only** (15-20% visual weight)
- Modern design principles form the **primary foundation** (80-85% visual weight)
- Readability is never compromised for aesthetic
- Minimalism over decoration

**Critical Rule:** Pixel fonts (Silkscreen) are for labels, badges, and small headings ONLY. Never use for body text, articles, or long-form content.

### Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Fonts:** Geist (sans), Geist Mono (monospace), Silkscreen (pixel accent)
- **UI Components:** Custom components following design system
- **Testing:** Vitest + React Testing Library
- **Documentation:** Storybook
- **Theme:** next-themes for dark/light mode

### Project Structure

```
app/                      # Next.js App Router pages
├── layout.tsx           # Root layout with font setup
├── page.tsx             # Home page
├── posts/               # Blog posts
│   ├── page.tsx        # Posts listing
│   └── [slug]/page.tsx # Individual post (centered reading layout)
└── about/page.tsx       # About page

components/              # React components
├── blog-header.tsx     # Site navigation header
├── blog-footer.tsx     # Site footer
├── post-card.tsx       # Blog post card (featured & standard variants)
├── dot-decoration.tsx  # Decorative dot patterns (horizontal, vertical, corner, grid)
├── pixel-icons.tsx     # Custom 16x16 pixel SVG icons
├── file-explorer.tsx   # Sidebar file tree (demo)
└── theme-provider.tsx  # Dark mode provider

lib/                     # Utilities and helpers
├── utils.ts            # cn() helper for Tailwind
└── demo-posts.ts       # Demo content data

.claude/docs/guideline/  # Project documentation
├── GUIDELINE.md        # Overall project philosophy
└── notion-block-components.md  # TDD guide for Notion block components
```

### Notion CMS Architecture (Planned)

**Core Principle:** Notion blocks are rendered directly as React components, NOT converted to Markdown.

1. **Data Flow:** Notion API → Block Schema → React Components → Rendered Page
2. **No Markdown Layer:** This preserves Notion's structural meaning and allows full design control
3. **Component Mapping:** Each Notion block type (paragraph, heading_1, code, etc.) maps to a dedicated React component
4. **Recursive Rendering:** Blocks with `has_children` are handled recursively
5. **Image Handling:** Notion images are downloaded at build time and served locally, cached based on `last_edited_time`

**Key Files (To Be Implemented):**
- `lib/notion/rich-text-renderer.tsx` - Handles RichText arrays with annotations (bold, italic, code, links)
- `components/notion-blocks/` - Individual block components (Paragraph, Heading, Code, Callout, Image, etc.)
- `components/notion-blocks/BlockRenderer.tsx` - Main renderer that maps block types to components

**Development Approach:** Test-Driven Development (TDD)
- Write tests first for each component
- Implement component to pass tests
- Add Storybook stories for visual testing
- Complete one component fully before moving to the next

See [.claude/docs/guideline/notion-block-components.md](.claude/docs/guideline/notion-block-components.md) for detailed TDD workflow.

## Design System

Comprehensive design system documentation is in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). Key highlights:

### Color System
- **Achromatic Only:** Pure grays using `oklch(lightness 0 0)` with chroma = 0
- No blue-tinted grays (avoid slate/gray colors with hue)
- Use CSS variables: `--foreground`, `--background`, `--muted-foreground`, `--border`, `--accent`, etc.
- Opacity patterns for decorative elements: `/60`, `/40`, `/30`, `/20`, `/10`

### Typography
```tsx
// Pixel font application (Silkscreen)
className="font-[family-name:var(--font-silkscreen)] text-xs tracking-wider"

// Use cases: Labels, badges, navigation items, small section headers
// Never use for: Body text, articles, long-form content, main headings
```

### Layout Patterns
- **Wide Layout:** `max-w-6xl` for home, listings, card grids
- **Reading Layout:** `max-w-2xl` for article content (centered)
- **Spacing:** `px-6` horizontal padding, `py-16` section spacing, `gap-6` card grids

### Components
- All cards use `rounded-xl`, `border border-border`, hover transitions
- Featured cards include corner dot decorations
- Badges use pixel font with `text-[10px]`
- Icons are custom 16x16 pixel SVGs using `currentColor`

### Critical Rules
1. **Hydration Safety:** Never use `Math.random()` in render - use fixed pattern arrays
2. **Font Loading:** Always load fonts via `next/font/google` in layout.tsx
3. **Pixel Font Syntax:** Use `font-[family-name:var(--font-silkscreen)]` NOT inline styles
4. **Border Radius:** Never use `rounded-none` - maintain slight rounding for modern feel
5. **Readability First:** Body text uses Geist sans with `leading-relaxed`

## Configuration Notes

### TypeScript
- Path alias `@/` maps to project root
- Strict mode enabled
- Build errors are currently ignored (`ignoreBuildErrors: true` - should be addressed)

### Next.js
- Images are unoptimized (for free Vercel hosting)
- App Router with TypeScript
- ISR (Incremental Static Regeneration) will be used for Notion content

### Testing
- Vitest with jsdom environment
- Setup file: `vitest.setup.ts`
- React Testing Library for component tests
- Path alias `@/` configured

### Storybook
- NextJS Vite integration
- Addons: Chromatic, Vitest, a11y, Docs
- Stories location: `stories/**/*.stories.@(js|jsx|ts|tsx)`
- Static files served from `public/`

## Code Style Guidelines

### Component Structure
- Use functional components with TypeScript
- Props should have explicit interfaces
- Export types alongside components
- Use `cn()` utility from `lib/utils.ts` for conditional classes

### Styling Patterns
```tsx
// Card hover pattern
className="transition-all duration-300 hover:border-muted-foreground/30"

// Icon + text spacing
className="flex items-center gap-2"

// Pixel icon sizing
className="h-4 w-4"  // Standard navigation/buttons
className="h-3 w-3"  // Small metadata icons
className="h-2 w-2"  // Decorative dots
```

### Accessibility
- Use semantic HTML (`<header>`, `<main>`, `<article>`, `<nav>`)
- Icons need accompanying text or `aria-label`
- Maintain WCAG contrast ratios
- Pixel fonts only for decorative text, not essential content

### File References
When referencing code locations, use the format:
- Files: [filename.tsx](path/to/filename.tsx)
- Lines: [filename.tsx:42](path/to/filename.tsx#L42)
- Ranges: [filename.tsx:42-51](path/to/filename.tsx#L42-L51)

## Important Context

### What NOT to Do
- Don't convert Notion content to Markdown (preserves structure & allows custom rendering)
- Don't use pixel fonts for long-form content (readability first)
- Don't add random decorative elements (15-20% visual weight rule)
- Don't use Math.random() in components (causes hydration errors)
- Don't over-engineer solutions (simplicity over premature abstraction)
- Don't compromise backwards compatibility without good reason

### When Working on Notion Integration
1. Always refer to [.claude/docs/guideline/GUIDELINE.md](.claude/docs/guideline/GUIDELINE.md) for architectural decisions
2. Follow TDD approach from [.claude/docs/guideline/notion-block-components.md](.claude/docs/guideline/notion-block-components.md)
3. Test each block component thoroughly before moving to next
4. Use Storybook to verify visual appearance
5. Handle `has_children` recursively with depth limits

### Design System Adherence
- Reference [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for all styling decisions
- Colors must use `oklch(lightness 0 0)` - pure achromatic
- Maintain 80/15 modern/retro visual weight balance
- Test both light and dark modes
- Check all states: default, hover, active, disabled
