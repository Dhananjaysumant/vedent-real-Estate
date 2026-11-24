import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config';
import type { EnquiryRequest } from '../validation/schemas';

export interface StoredEnquiry {
  id: string;
  reference: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  propertySlug?: string;
  preferredDate?: string;
  contactMethod: 'email' | 'phone';
  message?: string;
  consent: true;
  consentAt: string;
  source: string;
  ipHash: string;
}

function assertSafeStorePath(): void {
  const relative = path.relative(config.publicDir, config.storePath);
  if (!relative.startsWith('..') && !path.isAbsolute(relative)) {
    throw new Error('Refusing to store enquiries inside the public directory.');
  }
  const distRelative = path.relative(config.distDir, config.storePath);
  if (!distRelative.startsWith('..') && !path.isAbsolute(distRelative)) {
    throw new Error('Refusing to store enquiries inside the distribution directory.');
  }
}

export async function saveEnquiry(
  enquiry: EnquiryRequest,
  meta: { ipHash: string; source: string },
): Promise<{ reference: string; receivedAt: string }> {
  assertSafeStorePath();
  const now = new Date();
  const reference = `VE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const record: StoredEnquiry = {
    id: crypto.randomUUID(),
    reference,
    createdAt: now.toISOString(),
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone || undefined,
    propertySlug: enquiry.propertySlug || undefined,
    preferredDate: enquiry.preferredDate || undefined,
    contactMethod: enquiry.contactMethod,
    message: enquiry.message || undefined,
    consent: true,
    consentAt: now.toISOString(),
    source: meta.source,
    ipHash: meta.ipHash,
  };

  await fs.mkdir(path.dirname(config.storePath), { recursive: true });
  await fs.appendFile(config.storePath, `${JSON.stringify(record)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
  await fs.chmod(config.storePath, 0o600).catch(() => {
    /* chmod is not available on every platform; the path remains outside public. */
  });

  return { reference, receivedAt: record.createdAt };
}
