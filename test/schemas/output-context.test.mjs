import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, BASE } from '../helpers/validator.mjs';

const ID = `${BASE}/output-context.schema.json`;
const META = { agent_id: 'a1', session_id: 's1', timestamp: '2026-01-01T00:00:00Z' };

describe('OutputContext schema', () => {
  describe('valid', () => {
    it('accepts a valid output context', async () => {
      const { valid } = await validate(ID, {
        response: { role: 'assistant', content: 'Here is the result.' },
        metadata: META,
      });
      assert.ok(valid);
    });
  });

  describe('invalid', () => {
    it('rejects missing response', async () => {
      const { valid } = await validate(ID, { metadata: META });
      assert.ok(!valid);
    });

    it('rejects missing metadata', async () => {
      const { valid } = await validate(ID, {
        response: { role: 'assistant', content: 'hi' },
      });
      assert.ok(!valid);
    });

    it('rejects a response with a non-assistant role', async () => {
      const { valid } = await validate(ID, {
        response: { role: 'user', content: 'hi' },
        metadata: META,
      });
      assert.ok(!valid);
    });

    it('rejects additional properties at the top level', async () => {
      const { valid } = await validate(ID, {
        response: { role: 'assistant', content: 'ok' },
        metadata: META,
        extra: true,
      });
      assert.ok(!valid);
    });
  });
});
