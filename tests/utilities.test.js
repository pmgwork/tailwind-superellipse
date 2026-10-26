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
    const css = await build([`squircle-${size}`]);
    assert.ok(css.includes(`.squircle-${size}`));
    assert.ok(css.includes(`border-radius: var(--radius-${size})`));
    assert.ok(css.includes('@supports (corner-shape: superellipse(1.5))'));
    assert.ok(css.includes(`calc(var(--radius-${size}) * var(--superellipse-scale, 1.5))`));
    assert.ok(css.includes('superellipse(var(--superellipse-exponent, 1.5))'));
  }
});

test('full keeps its independent default exponent without scaling', async () => {
  const css = await build(['squircle-full']);
  assert.ok(css.includes('border-radius: 1000px'));
  assert.ok(css.includes('superellipse(var(--superellipse-exponent, 1.1))'));
  assert.ok(!css.includes('var(--superellipse-scale'));
});

test('responsive and hover variants include the complete utility', async () => {
  const css = await build(['md:squircle-xl', 'hover:squircle-lg']);
  assert.ok(css.includes('.md\\:squircle-xl'));
  assert.ok(css.includes('@media (width >= 48rem)'));
  assert.ok(css.includes('.hover\\:squircle-lg'));
  // Tailwind may preserve nesting or emit a flattened selector.
  assert.match(css, /(?:&|\.hover\\:squircle-lg):hover\s*\{/);
  assert.equal(css.match(/corner-shape: superellipse\(var/g)?.length, 2);
});

test('uses the consumer radius theme and excludes unused utilities', async () => {
  const css = await build(['squircle-lg'], '@theme { --radius-lg: 3rem; }');
  assert.ok(css.includes('--radius-lg: 3rem'));
  assert.ok(css.includes('border-radius: var(--radius-lg)'));
  assert.ok(!css.includes('.squircle-md'));
  assert.ok(!css.includes('.squircle-full'));
});

test('arbitrary values and CSS variables use the same scaling', async () => {
  const css = await build(['squircle-[20px]', 'squircle-(length:--my-r)', 'md:squircle-[10px]']);
  assert.ok(css.includes('border-radius: 20px'));
  assert.ok(css.includes('calc(20px * var(--superellipse-scale, 1.5))'));
  assert.ok(css.includes('border-radius: var(--my-r)'));
  assert.ok(css.includes('calc(var(--my-r) * var(--superellipse-scale, 1.5))'));
  assert.ok(css.includes('calc(10px * var(--superellipse-scale, 1.5))'));
  assert.equal(css.match(/corner-shape: superellipse\(var/g)?.length, 3);
});

test('rejects values that are not lengths or theme radii', async () => {
  const css = await build(['squircle-[red]', 'squircle-foo']);
  assert.ok(!css.includes('corner-shape'));
});

test('side and corner variants mirror rounded-*', async () => {
  const expected = {
    t: ['border-top-left-radius', 'border-top-right-radius'],
    s: ['border-start-start-radius', 'border-end-start-radius'],
    tl: ['border-top-left-radius'],
    ee: ['border-end-end-radius'],
  };
  for (const [key, props] of Object.entries(expected)) {
    const css = await build([`squircle-${key}-lg`, `squircle-${key}`, `squircle-${key}-[20px]`]);
    for (const prop of props) {
      assert.ok(css.includes(`${prop}: var(--radius-lg)`), `${key}-lg ${prop}`);
      assert.ok(css.includes(`${prop}: 0.25rem`), `${key} ${prop}`);
      assert.ok(css.includes(`${prop}: calc(20px * var(--superellipse-scale, 1.5))`), `${key}-[20px] ${prop}`);
    }
    assert.ok(!css.includes('\n  border-radius:'));
  }
});

test('none and full work for the whole element and for sides', async () => {
  const css = await build(['squircle-none', 'squircle-t-none', 'squircle-b-full']);
  assert.ok(css.includes('border-radius: 0'));
  assert.ok(css.includes('border-top-left-radius: 0'));
  assert.ok(css.includes('border-bottom-left-radius: 1000px'));
  assert.ok(css.includes('superellipse(var(--superellipse-exponent, 1.1))'));
});

test('a side utility overrides the all-corners utility regardless of class order', async () => {
  const css = await build(['squircle-tl-none', 'squircle-lg']);
  assert.ok(css.indexOf('.squircle-lg') < css.indexOf('.squircle-tl-none'));
});
