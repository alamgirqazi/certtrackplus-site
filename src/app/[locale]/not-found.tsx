import { Button } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale } from "@/i18n/config";
import { href } from "@/lib/routes";

export default function LocaleNotFound() {
  const t = getDictionary(defaultLocale);
  return (
    <section className="u-shell flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-mono text-[15px] font-medium text-azure-300">{t.notFound.code}</p>
      <h1 className="u-balance mt-5 max-w-2xl text-3xl font-semibold text-ink sm:text-4xl">{t.notFound.title}</h1>
      <p className="u-pretty mt-5 max-w-xl text-lg text-ink-soft">{t.notFound.body}</p>
      <div className="mt-9">
        <Button href={href(defaultLocale, "home")}>{t.notFound.cta}</Button>
      </div>
    </section>
  );
}
