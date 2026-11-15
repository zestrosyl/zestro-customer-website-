import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { transformWithOxc } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

describe('ZESTRO Customer Website — QR Parser, Build Assets & Live-Only Safeguards', () => {
  it('1. parseTableQrPayload handles Admin QR URLs (?table=T-01), numeric codes, JSON payloads, UUIDs, and rejects non-Zestro URLs', async () => {
    const rawTs = fs.readFileSync(path.join(REPO_ROOT, 'src/utils/tableQrParser.ts'), 'utf8');
    const transformed = await transformWithOxc(rawTs, 'tableQrParser.ts', { lang: 'ts' });
    const mod = await import(
      `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`
    );
    const { parseTableQrPayload } = mod;

    assert.deepEqual(
      parseTableQrPayload('https://zestro-customer-website.pages.dev/menu?table=T-01'),
      { tableId: 'T-01', tableNumber: 'T-01' }
    );
    assert.deepEqual(
      parseTableQrPayload('https://zestro-customer-website.pages.dev/?table=04'),
      { tableId: '04', tableNumber: 'T-04' }
    );
    assert.deepEqual(parseTableQrPayload('table-07'), {
      tableId: 'table-07',
      tableNumber: 'T-07',
    });
    const uuid = '45291381-ba84-4e2f-a60c-1c39a119c2d7';
    assert.deepEqual(parseTableQrPayload(uuid), {
      tableId: uuid,
      tableNumber: uuid,
    });
    assert.deepEqual(
      parseTableQrPayload('{"tableId":"tbl_uuid_1","tableNumber":"T-12"}'),
      { tableId: 'tbl_uuid_1', tableNumber: 'T-12' }
    );
    assert.equal(parseTableQrPayload('https://example.com/unrelated-page'), null);
    assert.equal(parseTableQrPayload('   '), null);
  });

  it('2. Production dist/ contains _redirects, _headers (camera=(self)), hashed images, and zero broken /src/assets/ paths', () => {
    const distDir = path.join(REPO_ROOT, 'dist');
    assert.ok(fs.existsSync(path.join(distDir, 'index.html')), 'dist/index.html must exist');
    assert.ok(fs.existsSync(path.join(distDir, '_redirects')), 'dist/_redirects must exist');
    assert.ok(fs.existsSync(path.join(distDir, '_headers')), 'dist/_headers must exist');

    const headersText = fs.readFileSync(path.join(distDir, '_headers'), 'utf8');
    assert.match(headersText, /camera=\(self\)/);

    const assetsDir = path.join(distDir, 'assets');
    const assetFiles = fs.readdirSync(assetsDir);
    const jsBundle = assetFiles.find((f) => f.endsWith('.js'));
    assert.ok(jsBundle, 'JS bundle must exist');

    const jsContent = fs.readFileSync(path.join(assetsDir, jsBundle), 'utf8');
    assert.equal(
      jsContent.includes('/src/assets/images/'),
      false,
      'Production bundle must never contain raw /src/assets/images/ paths'
    );
  });

  it('3. StoreContext has zero fallback to INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_PROMOTIONS, or INITIAL_TABLES', () => {
    const storeSrc = fs.readFileSync(path.join(REPO_ROOT, 'src/context/StoreContext.tsx'), 'utf8');
    assert.equal(storeSrc.includes('INITIAL_PRODUCTS'), false);
    assert.equal(storeSrc.includes('INITIAL_CATEGORIES'), false);
    assert.equal(storeSrc.includes('INITIAL_PROMOTIONS'), false);
    assert.equal(storeSrc.includes('INITIAL_TABLES'), false);
  });

  it('4. No component calls a React hook after an early return (prevents minified React error #300 blank page)', () => {
    const files = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(REPO_ROOT, 'src'));
    assert.ok(files.length > 0, 'expected .tsx files under src/');

    const violations = [];
    for (const file of files) {
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      let earlyReturnLine = -1;
      lines.forEach((line, idx) => {
        // A new top-level declaration starts a new component scope.
        if (/^(export\s+)?(default\s+)?(const|function|class)\s/.test(line)) {
          earlyReturnLine = -1;
          return;
        }
        // Early return inside a top-level `if` of a component body (4-space indent).
        if (/^ {4}return\b/.test(line) && /^ {2}if\s*\(/.test(lines.slice(0, idx).reverse().find((l) => /^ {2}\S/.test(l)) || '')) {
          earlyReturnLine = idx + 1;
          return;
        }
        // One-line early return: `  if (cond) return null;`
        if (/^ {2}if\s*\(.*\)\s*return\b/.test(line)) {
          earlyReturnLine = idx + 1;
          return;
        }
        if (earlyReturnLine > 0 && /^ {2}(const|let)?.*\buse[A-Z]\w*\s*(<[^>]*>)?\(/.test(line)) {
          violations.push(`${path.relative(REPO_ROOT, file)}:${idx + 1} hook after early return at line ${earlyReturnLine}`);
        }
      });
    }
    assert.deepEqual(violations, [], `Hooks must run before any early return:\n${violations.join('\n')}`);
  });
});

