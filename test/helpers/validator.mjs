import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const schemasDir = join(__dirname, '../../schemas/v0.1.0');
export const BASE = 'https://agentpolicyspecification.github.io/schemas/v0.1.0';

let _ajv;

export async function getAjv() {
  if (_ajv) return _ajv;

  _ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(_ajv);

  const files = (await readdir(schemasDir)).filter(f => f.endsWith('.schema.json'));
  for (const file of files) {
    const schema = JSON.parse(await readFile(join(schemasDir, file), 'utf-8'));
    _ajv.addSchema(schema);
  }

  return _ajv;
}

export async function validate(schemaId, data) {
  const ajv = await getAjv();
  const fn = ajv.getSchema(schemaId);
  if (!fn) throw new Error(`Schema not found: ${schemaId}`);
  const valid = fn(data);
  return { valid, errors: fn.errors ?? [] };
}
