import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const result = await build({ entryPoints: ['src/main.js'], bundle: true, write: false, format: 'iife', target: 'es2020', minify: true, legalComments: 'inline' });
const html = (await readFile('src/index.html', 'utf8')).replace('/* APP_BUNDLE */', () => result.outputFiles[0].text.replaceAll('</script', '<\\/script'));
await mkdir('dist', {recursive:true});
await writeFile('dist/index.html', html);
await writeFile('index.html', html);
console.log(`Built standalone HTML: ${Buffer.byteLength(html)} bytes`);
