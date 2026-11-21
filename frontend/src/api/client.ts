import type { LoginResponse, User } from "../types/auth";

const API_BASE = "/api";
const TOKEN_KEY = "esimenade_access_token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = "Ocorreu um erro ao comunicar com o servidor.";
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") {
        detail = body.detail;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(detail, response.status);
  }

  return (await response.json()) as T;
}

export const authApi = {
  login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  me(): Promise<User> {
    return request<User>("/auth/me");
  },
  adminOverview(): Promise<{ message: string; role: string; permissions: string[] }> {
    return request("/admin/overview");
  },
  studentOverview(): Promise<{ message: string; role: string; permissions: string[] }> {
    return request("/student/overview");
  },
};
