import { site } from '@/content';
import { postJson } from './submit';
import type { SubmitResult } from './submit';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formats digits as (000)-000-0000 while typing. */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)})-${d.slice(3)}`;
  return `(${d.slice(0, 3)})-${d.slice(3, 6)}-${d.slice(6)}`;
}

export function phoneComplete(value: string): boolean {
  return value.replace(/\D/g, '').length === 10;
}

export interface ServiceRequest {
  typeId: string;
  /** clergy id or "office" */
  sendTo: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  lang: string;
}

/**
 * TODO(requests): send service requests to the priest or the parish office.
 * Point site.json "formsEndpoint" at a form service or a small server route that emails
 * the person in "sendTo". Until then the visitor sees a notice with the parish email.
 */
export function submitServiceRequest(request: ServiceRequest): Promise<SubmitResult> {
  return postJson(site.formsEndpoint, { kind: 'service-request', ...request });
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  lang: string;
}

/** TODO(contact): same endpoint as service requests; see site.json "formsEndpoint". */
export function submitContactMessage(message: ContactMessage): Promise<SubmitResult> {
  return postJson(site.formsEndpoint, { kind: 'contact', ...message });
}

/**
 * TODO(orthodoxconnect): subscribe to the parish newsletter on OrthodoxConnect.
 * Set site.json "orthodoxConnect.newsletter.endpoint" once the API is available.
 */
export function subscribeNewsletter(email: string, lang: string): Promise<SubmitResult> {
  return postJson(site.orthodoxConnect.newsletter.endpoint, { parishId: site.orthodoxConnect.parishId, email, lang });
}
