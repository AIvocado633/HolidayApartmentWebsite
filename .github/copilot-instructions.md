# Project Guidelines

## Overview
Holiday apartment rental website for a property in the Rhon region, Germany. Built with Next.js App Router, React 18, TypeScript, and Tailwind CSS. Single-page layout with anchor-based section navigation.

## Tech Stack
- Framework: Next.js App Router (app/ directory)
- UI: React 18 with TypeScript
- Styling: Tailwind CSS v3 - see tailwind.config.js and app/globals.css for the custom design system
- Icons: lucide-react only - never use other icon libraries
- Images: next/image only - never use a plain img element

## Language
- UI copy (labels, headings, body text) is written in German
- Code identifiers, comments, and git messages are in English

## Component Conventions
- Use named function declarations, not arrow functions, for components
- Always declare the explicit return type: (): React.JSX.Element
- Add the use-client directive only when the component needs state, effects, or browser APIs
- Extract static data into module-level const arrays named in SCREAMING_SNAKE_CASE with an explicit type annotation
- Use type aliases (not interface) for local types; only export a type if it is consumed in another file
- Import internal modules with the @/ path alias

## Styling
Prefer the custom utility classes from app/globals.css over raw Tailwind:
- Layout: section-container, section-padding
- Buttons: btn-primary, btn-outline, btn-ghost
- Typography: heading-xl, heading-lg, heading-md, heading-sm, label-overline
- Cards and inputs: card, input-field

Custom Tailwind design tokens (tailwind.config.js):
- Colors: cream, beige, accent, warm-50 through warm-900, slate-text
- Fonts: font-heading (Playfair Display, serif) and font-body (Plus Jakarta Sans, sans-serif)
- Buttons use rounded-none - no border-radius anywhere in the UI

## Accessibility
- Every landmark element (section, nav, header, footer) must have an aria-label
- Decorative icons and overlay divs must have aria-hidden set to true
- Navigation ul elements used as link lists must have role=list
- The global focus-visible outline from globals.css must not be overridden

## Architecture
- All page sections are self-contained components in the components/ folder
- Each section component has an id that matches its anchor link in the navigation
- Navigation links are defined in Navbar.tsx and must be mirrored in Footer.tsx

## Dev Commands
- npm run dev - start development server
- npm run build - production build
- npm run lint - run ESLint
