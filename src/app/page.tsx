import { defaultLocale } from "@/i18n/config";
import { site } from "@/lib/site";

/**
 * Static entry point.
 *
 * A static host cannot negotiate Accept-Language, so `/` is a thin routing
 * document: it redirects immediately and points its canonical at the English
 * edition. The <meta refresh> fires even with JavaScript disabled; the inline
 * script just gets there sooner.
 *
 * The site ships one locale today. The redirect is written to survive a second
 * one being added without this file changing shape.
 */
export const metadata = {
  title: site.name,
  description: site.tagline,
  alternates: {
    canonical: `${site.url}/${defaultLocale}/`,
    languages: { "x-default": `${site.url}/${defaultLocale}/` },
  },
  robots: { index: false, follow: true },
};

const REDIRECT = `(function(){try{location.replace("${defaultLocale}/"+location.search+location.hash)}catch(e){location.replace("${defaultLocale}/")}})();`;

export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=./${defaultLocale}/`} />
        <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      </head>
      <body style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", padding: "2rem" }}>
        <p>{site.name}</p>
        <p>
          <a href={`./${defaultLocale}/`} hrefLang="en">
            Continue to {site.domain}
          </a>
        </p>
      </body>
    </html>
  );
}
