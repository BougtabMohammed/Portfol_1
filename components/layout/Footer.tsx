import Link from 'next/link';
import { Mail } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { NAV_KEYS, ROUTES, route } from '@/lib/routes';
import { profile } from '@/content/data/profile';
import { ui } from '@/content/data/ui';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--color-border)] no-print">
      <div className="container-page py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="font-mono text-sm font-semibold">
              <span className="text-[var(--color-accent)]">MB</span>
              <span className="text-[var(--color-text-muted)]">/</span>{' '}
              {profile.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {profile.jobTitle[locale]} — {profile.location[locale]}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="grid size-9 place-items-center rounded-[6px] border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              >
                <Mail size={16} aria-hidden />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid size-9 place-items-center rounded-[6px] border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              >
                <GithubIcon size={16} aria-hidden />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid size-9 place-items-center rounded-[6px] border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              >
                <LinkedinIcon size={16} aria-hidden />
              </a>
            </div>
          </div>

          <nav aria-label={ui.nav.home[locale]}>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
              <li>
                <Link
                  href={route('home', locale)}
                  className="text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text)]"
                >
                  {ui.nav.home[locale]}
                </Link>
              </li>
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <Link
                    href={ROUTES[key][locale]}
                    className="text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text)]"
                  >
                    {ui.nav[key][locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={route('resume', locale)}
                  className="text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text)]"
                >
                  {ui.nav.resume[locale]}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p>{ui.meta.builtWith[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
