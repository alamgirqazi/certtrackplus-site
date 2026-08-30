/**
 * Sub-path the site is served from. Only non-empty for a GitHub *project*
 * page (https://user.github.io/repo); empty for a custom domain.
 *
 * Normalised so "repo", "/repo" and "/repo/" all behave identically, and so a
 * blank value from CI (GitHub Actions substitutes "" for an undefined
 * variable) means "no base path" rather than reaching Next as an empty string.
 *
 * Imported by next.config.ts as well as the app, so there is one definition.
 */
export function normaliseBasePath(value: string | undefined): string {
  const raw = value?.trim().replace(/^\/+|\/+$/g, "");
  return raw ? `/${raw}` : "";
}

export const basePath = normaliseBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** Prefix a root-relative asset path. Next does this for <Link> but not for
 *  URLs written by hand into the metadata object. */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
