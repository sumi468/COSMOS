// Isomorphic (works in Node, Edge, and the browser) base64url helpers.
// Used to turn an official source URL into a stable, reversible route id
// so detail pages never need a database — they just decode the id back
// into the URL and look the item up in the (cached) feed data.

export function encodeId(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const base64 =
    typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeId(id: string): string {
  const padded = id.replace(/-/g, "+").replace(/_/g, "/");
  const withPadding = padded + "===".slice((padded.length + 3) % 4);
  const binary =
    typeof atob === "function" ? atob(withPadding) : Buffer.from(withPadding, "base64").toString("binary");
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
