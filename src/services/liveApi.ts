export const API_BASE = (
  import.meta.env.VITE_ZESTRO_API_URL ||
  'https://zestro-customer-api.zestro-syl.workers.dev'
).replace(/\/+$/, '');

const CUSTOMER_TOKEN_KEY = 'zestro_customer_token_v1';

export function getCustomerToken(): string {
  try {
    return window.localStorage.getItem(CUSTOMER_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setCustomerToken(token: string | null): void {
  try {
    if (token) {
      window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted privacy contexts.
  }
}

export async function apiRequest<T = any>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PATCH'; body?: unknown } = {}
): Promise<T> {
  const method = options.method || 'GET';
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getCustomerToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `Request failed (${response.status})`) as Error & {
      code?: string;
    };
    if (data.code) error.code = String(data.code);
    throw error;
  }
  return data as T;
}

export async function postJson<T = any>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body });
}
