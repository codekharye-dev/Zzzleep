export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: "same-origin",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new ApiError("SERVICE_UNAVAILABLE", 503);
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("SERVICE_UNAVAILABLE", 503);
  }
  if (!response.ok)
    throw new ApiError(data.error || "SERVICE_UNAVAILABLE", response.status);
  return data as T;
}
