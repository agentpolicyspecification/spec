import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, BASE } from '../helpers/validator.mjs';

const ID = `${BASE}/tool-call-context.schema.json`;
const META = { agent_id: 'a1', session_id: 's1', timestamp: '2026-01-01T00:00:00Z' };

describe('ToolCallContext schema', () => {
  describe('valid', () => {
    it('accepts a minimal valid tool call context', async () => {
      const { valid } = await validate(ID, {
        tool_name: 'read_file',
        arguments: { path: '/data.txt' },
        calling_message: { role: 'assistant', content: 'I will read the file.' },
        metadata: META,
      });
      assert.ok(valid);
    });

    it('accepts empty arguments object', async () => {
      const { valid } = await validate(ID, {
        tool_name: 'list_files',
        arguments: {},
        calling_message: { role: 'assistant', content: 'Listing files.' },
        metadata: META,
      });
      assert.ok(valid);
    });

    it('accepts arguments with varied value types', async () => {
      const { valid } = await validate(ID, {
        tool_name: 'search',
        arguments: { query: 'hello', limit: 10, include_metadata: true },
        calling_message: { role: 'assistant', content: 'Searching.' },
        metadata: META,
      });
      assert.ok(valid);
    });
  });

  describe('invalid', () => {
    it('rejects missing tool_name', async () => {
      const { valid } = await validate(ID, {
        arguments: {},
        calling_message: { role: 'assistant', content: 'x' },
        metadata: META,
      });
      assert.ok(!valid);
    });

    it('rejects missing arguments', async () => {
      const { valid } = await validate(ID, {
        tool_name: 'read_file',
        calling_message: { role: 'assistant', content: 'x' },
        metadata: META,
      });
      assert.ok(!valid);
    });

    it('rejects a calling_message with non-assistant role', async () => {
      const { valid } = await validate(ID, {
        tool_name: 'read_file',
        arguments: {},
        calling_message: { role: 'user', content: 'x' },
        metadata: META,
      });
      assert.ok(!valid);
    });

    it('rejects missing calling_message', async () => {
      const { valid } = await validate(ID, {
        tool_name: 'read_file',
        arguments: {},
        metadata: META,
      });
      assert.ok(!valid);
    });
  });
});
