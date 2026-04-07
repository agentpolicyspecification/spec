import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, BASE } from '../helpers/validator.mjs';

const ID = `${BASE}/input-context.schema.json`;

const META = { agent_id: 'a1', session_id: 's1', timestamp: '2026-01-01T00:00:00Z' };

describe('InputContext schema', () => {
  describe('valid', () => {
    it('accepts a minimal valid context', async () => {
      const { valid } = await validate(ID, {
        messages: [{ role: 'user', content: 'hello' }],
        metadata: META,
      });
      assert.ok(valid);
    });

    it('accepts multiple messages with all roles', async () => {
      const { valid } = await validate(ID, {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'hi' },
          { role: 'assistant', content: 'hello' },
        ],
        metadata: META,
      });
      assert.ok(valid);
    });

    it('accepts metadata with extra fields', async () => {
      const { valid } = await validate(ID, {
        messages: [],
        metadata: { ...META, user_id: 'u1', environment: 'prod' },
      });
      assert.ok(valid);
    });
  });

  describe('invalid', () => {
    it('rejects missing messages', async () => {
      const { valid } = await validate(ID, { metadata: META });
      assert.ok(!valid);
    });

    it('rejects missing metadata', async () => {
      const { valid } = await validate(ID, {
        messages: [{ role: 'user', content: 'hi' }],
      });
      assert.ok(!valid);
    });

    it('rejects a message with an unknown role', async () => {
      const { valid } = await validate(ID, {
        messages: [{ role: 'tool', content: 'result' }],
        metadata: META,
      });
      assert.ok(!valid);
    });

    it('rejects metadata missing agent_id', async () => {
      const { valid } = await validate(ID, {
        messages: [],
        metadata: { session_id: 's1', timestamp: '2026-01-01T00:00:00Z' },
      });
      assert.ok(!valid);
    });

    it('rejects metadata with invalid timestamp format', async () => {
      const { valid } = await validate(ID, {
        messages: [],
        metadata: { agent_id: 'a1', session_id: 's1', timestamp: 'not-a-date' },
      });
      assert.ok(!valid);
    });
  });
});
