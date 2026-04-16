/**
 * GitHub Pages: site /repoadi/ altında yayınlanır; public dosyaları /repoadi/photos/... olur.
 * next.config basePath ile aynı repoyu kullan.
 */
const REPO = "Ufuk-ve-Sedef";

export const SITE_BASE_PATH = process.env.NODE_ENV === "production" ? `/${REPO}` : "";

export function assetUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${SITE_BASE_PATH}${path}`;
}
