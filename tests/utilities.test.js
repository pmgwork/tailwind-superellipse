import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { compile } from 'tailwindcss';

const utilities = await readFile(new URL('../index.css', import.meta.url), 'utf8');
const theme = await readFile(new URL(import.meta.resolve('tailwindcss/theme.css')), 'utf8');

async function build(candidates, extra = '') {
  const compiler = await compile(`${theme}\n${extra}\n${utilities}\n@tailwind utilities;`);
  return compiler.build(candidates);
}

test('all sizes include the ordinary radius and support-gated superellipse', async () => {
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']) {
    const css = await build([`corner-${size}`]);
    assert.ok(css.includes(`.corner-${size}`));
    assert.ok(css.includes(`border-radius: var(--radius-${size})`));
    assert.ok(css.includes('@supports (corner-shape: superellipse(1.5))'));
    assert.ok(css.includes(`calc(var(--radius-${size}) * var(--superellipse-scale, 1.5))`));
    assert.ok(css.includes('superellipse(var(--superellipse-exponent, 1.5))'));
  }
});

test('full keeps its independent default exponent without scaling', async () => {
  const css = await build(['corner-full']);
  assert.ok(css.includes('border-radius: 1000px'));
  assert.ok(css.includes('superellipse(var(--superellipse-exponent, 1.1))'));
  assert.ok(!css.includes('var(--superellipse-scale'));
});

test('responsive and hover variants include the complete utility', async () => {
  const css = await build(['md:corner-xl', 'hover:corner-lg']);
  assert.ok(css.includes('.md\\:corner-xl'));
  assert.ok(css.includes('@media (width >= 48rem)'));
  assert.ok(css.includes('.hover\\:corner-lg'));
  // Tailwind may preserve nesting or emit a flattened selector.
  assert.match(css, /(?:&|\.hover\\:corner-lg):hover\s*\{/);
  assert.equal(css.match(/corner-shape: superellipse\(var/g)?.length, 2);
});

test('uses the consumer radius theme and excludes unused utilities', async () => {
  const css = await build(['corner-lg'], '@theme { --radius-lg: 3rem; }');
  assert.ok(css.includes('--radius-lg: 3rem'));
  assert.ok(css.includes('border-radius: var(--radius-lg)'));
  assert.ok(!css.includes('.corner-md'));
  assert.ok(!css.includes('.corner-full'));
});
