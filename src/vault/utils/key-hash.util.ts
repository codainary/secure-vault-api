import { createHash } from 'crypto';

export function generateKeyHash(key: Buffer): string {
  return createHash('sha256').update(key).digest('hex');
}
