import { describe, expect, it } from 'vitest';

import { deleteKeys, getJson, setJson } from '../services/cache.service.js';

describe('cache service', () => {
  it('does not throw when Redis is not connected', async () => {
    await expect(getJson<{ ok: boolean }>('test:key')).resolves.toBeNull();
    await expect(setJson('test:key', { ok: true })).resolves.toBeUndefined();
    await expect(deleteKeys(['test:key'])).resolves.toBeUndefined();
  });
});
