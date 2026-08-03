import type { Locale } from '@/lib/i18n';
import { route } from '@/lib/routes';
import { faqItems } from '@/content/data/faq';
import { ui } from '@/content/data/ui';
import { PageShell } from '@/components/layout/PageShell';
import { ContactCta } from '@/components/sections/ContactCta';
import { Label } from '@/components/ui/primitives';
import { JsonLd, jsonLdGraph, personSchema, websiteSchema, faqSchema } from '@/lib/jsonld';

/**
 * FAQ — le principal actif GEO/AEO du site.
 *
 * Rendue entièrement dépliée, en HTML statique, sans accordéon : un contenu
 * masqué derrière une interaction JavaScript n'est pas toujours lu par les
 * crawlers, et jamais par ceux qui n'exécutent pas de script — c'est-à-dire la
 * plupart des robots des moteurs de réponse. Chaque réponse est autonome et
 * reste exacte si elle est citée seule.
 */
export function FaqView({ locale }: { locale: Locale }) {
  const path = route('faq', locale);
  const alternate = route('faq', locale === 'fr' ? 'en' : 'fr');

  return (
    <PageShell locale={locale} currentKey="faq" alternateHref={alternate}>
      <JsonLd
        data={jsonLdGraph(personSchema(locale), websiteSchema(locale), faqSchema(locale, path))}
      />

      <div className="container-page py-16 md:py-20">
        <header className="mb-14">
          <Label className="mb-3">{ui.nav.faq[locale]}</Label>
          <h1 className="max-w-3xl text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
            {locale === 'fr' ? 'Questions fréquentes' : 'Frequently asked questions'}
          </h1>
          <p className="prose-column mt-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
            {locale === 'fr'
              ? 'Des réponses directes aux questions que posent le plus souvent recruteurs et clients.'
              : 'Direct answers to the questions recruiters and clients ask most often.'}
          </p>
        </header>

        <div className="space-y-10">
          {faqItems.map((item, index) => (
            <section key={item.id} id={item.id} className="scroll-mt-24">
              <div className="grid gap-3 md:grid-cols-[64px_1fr] md:gap-8">
                <Label className="md:pt-1">{String(index + 1).padStart(2, '0')}</Label>
                <div>
                  <h2 className="text-lg font-semibold leading-snug tracking-[-0.01em] md:text-xl">
                    {item.question[locale]}
                  </h2>
                  <p className="prose-column mt-3 leading-relaxed text-[var(--color-text-muted)]">
                    {item.answer[locale]}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <ContactCta locale={locale} />
    </PageShell>
  );
}
