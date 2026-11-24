export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

export async function postJson<T>(
  path: string,
  body: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    signal: options.signal,
    credentials: 'same-origin',
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
    fields?: Record<string, string>;
  };

  if (!response.ok) {
    throw new ApiError(
      data.message ?? 'The request could not be completed. Please try again.',
      response.status,
      data.fields,
    );
  }

  return data as T;
}
