import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { schemasDir, BASE } from './helpers/validator.mjs';

const EXPECTED_SCHEMA = 'https://json-schema.org/draft/2020-12/schema';

function collectRefs(node, refs = []) {
  if (typeof node !== 'object' || node === null) return refs;
  if (Array.isArray(node)) { node.forEach(v => collectRefs(v, refs)); return refs; }
  for (const [key, val] of Object.entries(node)) {
    if (key === '$ref' && typeof val === 'string') refs.push(val);
    else collectRefs(val, refs);
  }
  return refs;
}

describe('Schema lint', async () => {
  const files = (await readdir(schemasDir)).filter(f => f.endsWith('.schema.json'));
  const schemas = {};

  for (const file of files) {
    const raw = await readFile(join(schemasDir, file), 'utf-8');
    schemas[file] = { raw, parsed: JSON.parse(raw) };
  }

  for (const [file, { parsed }] of Object.entries(schemas)) {
    describe(file, () => {
      it('has $schema set to JSON Schema 2020-12', () => {
        assert.equal(parsed['$schema'], EXPECTED_SCHEMA);
      });

      it('has a $id matching the canonical URL', () => {
        assert.ok(parsed['$id'], '$id must be present');
        assert.equal(parsed['$id'], `${BASE}/${file}`);
      });

      it('has a non-empty title', () => {
        assert.ok(typeof parsed.title === 'string' && parsed.title.length > 0, 'title must be a non-empty string');
      });

      it('has a non-empty description', () => {
        assert.ok(typeof parsed.description === 'string' && parsed.description.length > 0, 'description must be a non-empty string');
      });

      it('all $ref targets resolve to a known schema or anchor', () => {
        const refs = collectRefs(parsed);
        for (const ref of refs) {
          const [file_, fragment] = ref.split('#');
          const resolvedFile = file_.startsWith('./')
            ? file_.slice(2)
            : file_ === ''
              ? file
              : null;

          assert.ok(resolvedFile !== null, `$ref "${ref}" is not a relative file reference`);
          assert.ok(resolvedFile in schemas, `$ref "${ref}" points to unknown file "${resolvedFile}"`);

          if (fragment) {
            const parts = fragment.split('/').filter(Boolean);
            assert.equal(parts[0], '$defs', `$ref fragment "${fragment}" must start with /$defs`);
            const defName = parts[1];
            assert.ok(defName, `$ref fragment "${fragment}" must name a $def`);
            const target = schemas[resolvedFile].parsed;
            assert.ok(
              target.$defs && defName in target.$defs,
              `$ref "${ref}" — $defs.${defName} not found in ${resolvedFile}`
            );
          }
        }
      });
    });
  }
});
