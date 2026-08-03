import type { Locale } from '@/lib/i18n';
import { thesis } from '@/content/data/profile';
import { Label, Section } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';

/**
 * La thèse — le cœur de la différenciation.
 *
 * Placée après la preuve et avant les projets : le visiteur a déjà de quoi
 * juger avant de lire un argument, ce qui change la façon dont il le reçoit.
 */
export function Thesis({ locale }: { locale: Locale }) {
  return (
    <Section id="thesis">
      <div className="container-page">
        <Reveal>
          <Label className="mb-4">01 — {thesis.title[locale]}</Label>
          <div className="prose-column space-y-5 text-lg leading-relaxed">
            {thesis.body[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="mt-10 max-w-3xl border-l-2 border-[var(--color-accent)] py-1 pl-6">
            <p className="text-xl font-medium leading-relaxed tracking-[-0.01em] md:text-2xl">
              {thesis.pullQuote[locale]}
            </p>
          </blockquote>
        </Reveal>
      </div>
    </Section>
  );
}
