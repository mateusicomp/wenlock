export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type UsersListResponse = {
  data: Array<{
    id: string;
    name: string;
    email: string;
    registration: string;
    createdAt: string;
    updatedAt: string;
  }>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchUsers(params: {
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<UsersListResponse> {
  const url = new URL(`${API_BASE}/users`);
  if (params.search !== undefined) url.searchParams.set("search", params.search);
  if (params.page !== undefined) url.searchParams.set("page", String(params.page));
  if (params.limit !== undefined) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: params.signal,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch users (${res.status}): ${text}`);
  }

  return res.json();
}
