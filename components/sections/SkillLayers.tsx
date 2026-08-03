import type { Locale } from '@/lib/i18n';
import { skillGroups } from '@/content/data/skills';
import { Tag } from '@/components/ui/primitives';
import { Reveal } from '@/components/motion/Reveal';
import { staggerDelay } from '@/lib/motion';

/** Compétences par couche, dans l'ordre du parcours : de la donnée à la décision. */
export function SkillLayers({ locale }: { locale: Locale }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-[var(--color-border)]">
      {skillGroups.map((group, index) => (
        <Reveal as="li" key={group.id} delay={staggerDelay(index)}>
          <div className="grid gap-4 bg-[var(--color-surface)] p-6 md:grid-cols-[220px_1fr] md:gap-8 md:p-7">
            <div>
              <h3 className="font-mono text-sm font-medium text-[var(--color-accent)]">
                {group.title[locale]}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {group.caption[locale]}
              </p>
            </div>
            <ul className="flex flex-wrap gap-1.5 self-start">
              {group.skills.map((skill) => (
                <li key={skill}>
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
