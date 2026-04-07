import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, BASE } from '../helpers/validator.mjs';

const ID = `${BASE}/dsl-policy.schema.json`;

describe('DSLPolicy schema', () => {
  describe('conditions', () => {
    it('accepts an always condition with allow', async () => {
      const { valid } = await validate(ID, {
        condition: { always: true },
        action: 'allow',
      });
      assert.ok(valid);
    });

    it('accepts an equals condition', async () => {
      const { valid } = await validate(ID, {
        condition: { field: 'tool_name', equals: 'delete_file' },
        action: 'deny',
        reason: 'Deletion not permitted',
      });
      assert.ok(valid);
    });

    it('accepts a contains condition', async () => {
      const { valid } = await validate(ID, {
        condition: { field: 'messages.0.content', contains: ['password', 'secret'] },
        action: 'redact',
        redactions: [{ field: 'messages.0.content', strategy: 'mask', replacement: '[REDACTED]' }],
      });
      assert.ok(valid);
    });

    it('accepts a not_in condition', async () => {
      const { valid } = await validate(ID, {
        condition: { field: 'tool_name', not_in: ['read_file', 'list_files'] },
        action: 'deny',
      });
      assert.ok(valid);
    });

    it('accepts a greater_than condition', async () => {
      const { valid } = await validate(ID, {
        condition: { field: 'messages.length', greater_than: 50 },
        action: 'deny',
        reason: 'Context window too large',
      });
      assert.ok(valid);
    });
  });

  describe('actions', () => {
    it('accepts all valid action values', async () => {
      for (const action of ['allow', 'deny', 'audit']) {
        const { valid } = await validate(ID, { condition: { always: true }, action });
        assert.ok(valid, `action "${action}" should be valid`);
      }
    });

    it('accepts redact action with redactions', async () => {
      const { valid } = await validate(ID, {
        condition: { always: true },
        action: 'redact',
        redactions: [{ field: 'response.content', strategy: 'remove' }],
      });
      assert.ok(valid);
    });

    it('accepts transform action with transformation', async () => {
      const { valid } = await validate(ID, {
        condition: { always: true },
        action: 'transform',
        transformation: { 'messages.0.content': 'Safe: {{messages.0.content}}' },
      });
      assert.ok(valid);
    });
  });

  describe('invalid', () => {
    it('rejects missing condition', async () => {
      const { valid } = await validate(ID, { action: 'allow' });
      assert.ok(!valid);
    });

    it('rejects missing action', async () => {
      const { valid } = await validate(ID, { condition: { always: true } });
      assert.ok(!valid);
    });

    it('rejects an unknown action', async () => {
      const { valid } = await validate(ID, { condition: { always: true }, action: 'block' });
      assert.ok(!valid);
    });

    it('rejects an empty condition object', async () => {
      const { valid } = await validate(ID, { condition: {}, action: 'allow' });
      assert.ok(!valid);
    });

    it('rejects always condition with false value', async () => {
      const { valid } = await validate(ID, { condition: { always: false }, action: 'allow' });
      assert.ok(!valid);
    });
  });
});
