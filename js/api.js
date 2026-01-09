// 共通APIクライアント
// Cloudflare Access の Cookie を含めて Worker API を呼び出す

export const API_BASE = "https://api.mahikari.org/api";

export async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: "include", // ★これが最重要（Access cookie）
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  // Access 未ログイン時は HTML が返ることがあるため text で受ける
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      data?.error
        ? JSON.stringify(data)
        : text.slice(0, 300);
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }

  return data;
}