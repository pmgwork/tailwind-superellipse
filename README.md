# tailwind-superellipse

Superellipse corner utilities for Tailwind CSS v4. Use `corner-*` classes to give cards, buttons, and other elements smooth corners with native CSS.

[English](./README.md) · [日本語](./README.ja.md)

- CSS-only utilities; no JavaScript runtime.
- Uses your Tailwind radius theme.
- Works with responsive and state variants.
- Falls back to ordinary rounded corners when `corner-shape` is unsupported.

## Installation

Requires **Tailwind CSS 4.1 or later within v4**. This package contains source CSS that must be processed by Tailwind at build time.

The package is not yet published to npm. To try it, download or clone this repository and create a package from its root directory:

```sh
npm pack
```

Then install the generated file in your Tailwind project, replacing the path below with its actual location:

```sh
npm install /absolute/path/to/tailwind-superellipse-0.1.0.tgz
```

Import the utilities after Tailwind in your entry CSS:

```css
@import "tailwindcss";
@import "tailwind-superellipse";
```

## Usage

```html
<div class="corner-lg bg-gray-100 p-6">Card</div>
<div class="corner-md md:corner-xl">Responsive card</div>
<button class="corner-lg hover:corner-xl px-4 py-2">Button</button>
<div class="corner-full px-4 py-2">Badge</div>
```

Use `corner-*` where you would normally use `rounded-*`. Each utility sets both the radius and, in supporting browsers, the corner shape.

### Available utilities

| Class | Base radius |
| --- | --- |
| `corner-xs` | `var(--radius-xs)` |
| `corner-sm` | `var(--radius-sm)` |
| `corner-md` | `var(--radius-md)` |
| `corner-lg` | `var(--radius-lg)` |
| `corner-xl` | `var(--radius-xl)` |
| `corner-2xl` | `var(--radius-2xl)` |
| `corner-3xl` | `var(--radius-3xl)` |
| `corner-4xl` | `var(--radius-4xl)` |
| `corner-full` | `1000px` |

In supporting browsers, the theme radius is multiplied by **1.5** and the shape is set to `superellipse(1.5)` by default. `corner-full` keeps its fixed radius and uses `superellipse(1.1)`.

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
| `--superellipse-exponent` | `1.5`; `1.1` for `corner-full` | Argument passed to `superellipse()`. An explicit value overrides both defaults. |
| `--superellipse-scale` | `1.5` | Radius multiplier in supporting browsers. Does not affect `corner-full`. |

These properties inherit from parent elements. The `superellipse()` argument is not a Figma corner smoothing percentage.

## Browser support

The enhanced shape and radius multiplier are applied inside this feature query:

```css
@supports (corner-shape: superellipse(1.5)) {
  /* Superellipse corners */
}
```

Browsers that do not support it use the unscaled theme radius, or `1000px` for `corner-full`. This package uses native CSS and does not include a polyfill to reproduce the same shape in unsupported browsers.

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
