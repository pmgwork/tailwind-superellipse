// Builds demo/index.html: node demo/build.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { compile } from 'tailwindcss';

const read = (url) => readFile(new URL(url), 'utf8');
const theme = await read(import.meta.resolve('tailwindcss/theme.css'));
const utilities = await read(new URL('../index.css', import.meta.url));
const page = await read(new URL('./template.html', import.meta.url));

const classes = [...page.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
const compiler = await compile(`${theme}\n${utilities}\n@tailwind utilities;`);
const css = compiler.build(classes);
await writeFile(new URL('./index.html', import.meta.url), page.replace('/* CSS */', css));
console.log(`demo/index.html: ${classes.length} classes`);
