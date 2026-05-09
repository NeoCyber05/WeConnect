const BASE_URL = (import.meta.env.VITE_API_URL as string) || "";

async function getToken(): Promise<string | null> {
  return localStorage.getItem("access_token");
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("access_token", data.data.access_token);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  const token = skipAuth ? null : await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  console.log(`[apiFetch] Calling: ${BASE_URL}${path}`, { method: options.method || "GET" });
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  console.log(`[apiFetch] Response received for ${path}: ${res.status}`);

  if (res.status === 401 && !skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = localStorage.getItem("access_token");
      headers["Authorization"] = `Bearer ${newToken}`;
      const retryRes = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      if (!retryRes.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("current_user");
        window.location.href = "/login";
        throw new Error("Session expired");
      }
      if (retryRes.status === 204) return null as T;
      return retryRes.json();
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error(`[apiFetch] Error for ${path}:`, errData);
    throw new Error(errData.detail || `Error ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}
