import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, BASE } from '../helpers/validator.mjs';

const ID = `${BASE}/policy-decision.schema.json`;

describe('PolicyDecision schema', () => {
  describe('allow', () => {
    it('accepts a bare allow decision', async () => {
      const { valid } = await validate(ID, { decision: 'allow' });
      assert.ok(valid);
    });

    it('accepts allow with audit flag', async () => {
      const { valid } = await validate(ID, { decision: 'allow', audit: true });
      assert.ok(valid);
    });
  });

  describe('deny', () => {
    it('accepts a bare deny decision', async () => {
      const { valid } = await validate(ID, { decision: 'deny' });
      assert.ok(valid);
    });

    it('accepts deny with reason and policy_id', async () => {
      const { valid } = await validate(ID, {
        decision: 'deny',
        reason: 'Tool not permitted',
        policy_id: 'p1',
        audit: true,
      });
      assert.ok(valid);
    });
  });

  describe('redact', () => {
    it('accepts a redact decision with a mask redaction', async () => {
      const { valid } = await validate(ID, {
        decision: 'redact',
        redactions: [{ field: 'response.content', strategy: 'mask', replacement: '[REDACTED]' }],
      });
      assert.ok(valid);
    });

    it('accepts a redact decision with a replace redaction', async () => {
      const { valid } = await validate(ID, {
        decision: 'redact',
        redactions: [{ field: 'messages.0.content', strategy: 'replace', pattern: '\\d{4}', replacement: '****' }],
      });
      assert.ok(valid);
    });

    it('rejects redact with empty redactions array', async () => {
      const { valid } = await validate(ID, { decision: 'redact', redactions: [] });
      assert.ok(!valid);
    });

    it('rejects redact with missing redactions', async () => {
      const { valid } = await validate(ID, { decision: 'redact' });
      assert.ok(!valid);
    });
  });

  describe('transform', () => {
    it('accepts a transform decision with operations', async () => {
      const { valid } = await validate(ID, {
        decision: 'transform',
        transformation: {
          operations: [{ op: 'set', field: 'messages.0.content', value: 'sanitized' }],
        },
      });
      assert.ok(valid);
    });

    it('accepts prepend and append ops', async () => {
      const { valid } = await validate(ID, {
        decision: 'transform',
        transformation: {
          operations: [
            { op: 'prepend', field: 'messages.0.content', value: '[SAFE] ' },
            { op: 'append', field: 'messages.0.content', value: ' [END]' },
          ],
        },
      });
      assert.ok(valid);
    });

    it('rejects transform with missing transformation', async () => {
      const { valid } = await validate(ID, { decision: 'transform' });
      assert.ok(!valid);
    });
  });

  describe('audit', () => {
    it('accepts a bare audit decision', async () => {
      const { valid } = await validate(ID, { decision: 'audit' });
      assert.ok(valid);
    });

    it('accepts audit with reason', async () => {
      const { valid } = await validate(ID, { decision: 'audit', reason: 'Suspicious input logged.' });
      assert.ok(valid);
    });
  });

  describe('invalid', () => {
    it('rejects an unknown decision value', async () => {
      const { valid } = await validate(ID, { decision: 'skip' });
      assert.ok(!valid);
    });

    it('rejects missing decision', async () => {
      const { valid } = await validate(ID, { reason: 'no decision' });
      assert.ok(!valid);
    });
  });
});
