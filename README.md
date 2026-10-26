# tailwind-superellipse

Superellipse corner utilities for Tailwind CSS v4. Use `squircle-*` classes to give cards, buttons, and other elements smooth corners with native CSS.

[English](./README.md) · [日本語](./README.ja.md)

- CSS-only utilities; no JavaScript runtime.
- Uses your Tailwind radius theme.
- Works with responsive and state variants.
- Falls back to ordinary rounded corners when `corner-shape` is unsupported.

## Installation

Requires **Tailwind CSS 4.1 or later within v4**. This package contains source CSS that must be processed by Tailwind at build time.

```sh
npm install tailwind-superellipse
```

Import the utilities after Tailwind in your entry CSS:

```css
@import "tailwindcss";
@import "tailwind-superellipse";
```

## Usage

```html
<div class="squircle-lg bg-gray-100 p-6">Card</div>
<div class="squircle-md md:squircle-xl">Responsive card</div>
<button class="squircle-lg hover:squircle-xl px-4 py-2">Button</button>
<div class="squircle-full px-4 py-2">Badge</div>
```

Use `squircle-*` exactly where you would use `rounded-*`. Each utility sets both the radius and, in supporting browsers, the corner shape.

### Available utilities

| Pattern | Example | Radius |
| --- | --- | --- |
| `squircle` | `squircle` | `0.25rem` (same as `rounded`) |
| `squircle-{size}` | `squircle-lg` | `var(--radius-lg)`; `xs` to `4xl` from your theme |
| `squircle-none` | `squircle-none` | `0` |
| `squircle-full` | `squircle-full` | `1000px` |
| `squircle-[value]` | `squircle-[20px]` | Any length |
| `squircle-(length:--var)` | `squircle-(length:--card-radius)` | `var(--card-radius)` |

Every pattern above also works for sides and corners, as with `rounded-*`:

| Prefix | Target |
| --- | --- |
| `squircle-t-*`, `squircle-r-*`, `squircle-b-*`, `squircle-l-*` | Top, right, bottom, left sides |
| `squircle-s-*`, `squircle-e-*` | Inline start and end sides |
| `squircle-tl-*`, `squircle-tr-*`, `squircle-br-*`, `squircle-bl-*` | Physical corners |
| `squircle-ss-*`, `squircle-se-*`, `squircle-ee-*`, `squircle-es-*` | Logical corners |

```html
<div class="squircle-xl squircle-b-none">Rounded on top only</div>
<div class="squircle-[20px] md:squircle-tl-3xl">Arbitrary value</div>
<div class="squircle-(length:--card-radius)">CSS variable</div>
```

Radius values are scaled the same way for theme sizes and arbitrary values. In supporting browsers, they are multiplied by **1.5** and the shape is set to `superellipse(1.5)` by default. `squircle-none` stays `0`. `squircle-full` keeps its fixed radius and uses `superellipse(1.1)`.

## Customization

The utilities reference your existing `--radius-*` theme values without redefining them:

```css
@theme {
  --radius-lg: 0.75rem;
}
```

Adjust the shape and radius multiplier with CSS custom properties:

```css
:root {
  --superellipse-exponent: 1.5;
  --superellipse-scale: 1.5;
}

/* Override the shape for a specific element or subtree. */
.soft-corners {
  --superellipse-exponent: 1.25;
}
```

| Property | Default | Effect |
| --- | --- | --- |
| `--superellipse-exponent` | `1.5`; `1.1` for `squircle-full` | Argument passed to `superellipse()`. An explicit value overrides both defaults. |
| `--superellipse-scale` | `1.5` | Radius multiplier in supporting browsers. Does not affect `squircle-full`. |

These properties inherit from parent elements. The `superellipse()` argument is not a Figma corner smoothing percentage.

## Browser support

The enhanced shape and radius multiplier are applied inside this feature query:

```css
@supports (corner-shape: superellipse(1.5)) {
  /* Superellipse corners */
}
```

Browsers that do not support it use the unscaled theme radius, or `1000px` for `squircle-full`. This package uses native CSS and does not include a polyfill to reproduce the same shape in unsupported browsers.

Visual behavior has not yet been verified across browsers.

## Development

```sh
npm install
npm test
npm pack --dry-run
```

Tests compile the utilities with Tailwind and check sizes, feature queries, variants, theme references, and exclusion of unused utilities. They do not replace visual browser checks. Tests also run automatically before `npm publish`.

## License

[MIT](./LICENSE)
