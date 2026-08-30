import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale } from "@/i18n/config";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Root 404 — reached for paths that never resolved to a locale segment.
 * The root layout is a pass-through, so this page renders its own document
 * and cannot rely on the site stylesheet.
 */
export default function RootNotFound() {
  const t = getDictionary(defaultLocale);
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#f7f8fc",
          color: "#14162e",
        }}
      >
        <main style={{ maxWidth: "34rem", padding: "2rem", textAlign: "center" }}>
          <p style={{ letterSpacing: "0.14em", fontSize: 12, color: "#6fb6f1", margin: 0 }}>{t.notFound.code}</p>
          <h1 style={{ fontSize: "1.85rem", margin: "1rem 0 0", lineHeight: 1.15 }}>{t.notFound.title}</h1>
          <p style={{ color: "#3d4064", lineHeight: 1.6 }}>{t.notFound.body}</p>
          <p style={{ marginTop: "1.75rem" }}>
            <Link
              href={href(defaultLocale, "home")}
              style={{
                display: "inline-block",
                background: "#1a7fd1",
                color: "#fff",
                padding: "0.8rem 1.4rem",
                borderRadius: 4,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {t.notFound.cta}
            </Link>
          </p>
          <p style={{ marginTop: "1.5rem", fontSize: 13, color: "#62658a" }}>{site.name}</p>
        </main>
      </body>
    </html>
  );
}
