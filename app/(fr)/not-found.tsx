import Link from 'next/link';
import { ui } from '@/content/data/ui';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="label-mono mb-4">404</p>
        <h1 className="text-2xl font-semibold tracking-[-0.015em] md:text-3xl">
          {ui.meta.notFoundTitle.fr}
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)]">{ui.meta.notFoundBody.fr}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-[6px] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)]"
        >
          {ui.meta.backHome.fr}
        </Link>
      </div>
    </main>
  );
}
