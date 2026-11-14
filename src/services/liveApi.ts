export const API_BASE = (
  import.meta.env.VITE_ZESTRO_API_URL ||
  'https://zestro-customer-api.zestro-syl.workers.dev'
).replace(/\/+$/, '');

export async function postJson<T = any>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data as T;
}
