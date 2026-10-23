export function safeRedirect(url: string, baseUrl: string): string {
  try {
    const base = new URL(baseUrl);
    const target = new URL(url, base);
    return target.origin === base.origin &&
      ["https:", "http:"].includes(target.protocol)
      ? target.href
      : `${base.origin}/learn`;
  } catch {
    return `${baseUrl}/learn`;
  }
}
