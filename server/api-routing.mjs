export function forwardedApiUrl(rawUrl) {
  const url = new URL(rawUrl, "http://localhost");
  const route = url.searchParams.get("__zzzlep_route");
  if (route === null) return rawUrl;
  if (!/^[a-zA-Z0-9/_-]*$/.test(route)) return "/api/invalid-route";
  url.searchParams.delete("__zzzlep_route");
  const query = url.searchParams.toString();
  return "/api/" + route.replace(/^\/+/, "") + (query ? "?" + query : "");
}
