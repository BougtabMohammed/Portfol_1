/**
 * Applique le thème avant le premier rendu.
 *
 * Ce script est volontairement inline et synchrone dans le <head> : c'est la
 * seule façon d'éviter le flash de thème clair (FOUC) et le décalage de mise en
 * page qu'il provoquerait. Quelques centaines d'octets bloquants, contre un CLS
 * visible sur chaque chargement.
 */
const THEME_SCRIPT = `
(function () {
  var root = document.documentElement;
  // Marque l'exécution de JavaScript. Les animations de révélation ne masquent
  // leur contenu que si cette classe est présente : sans script, tout reste
  // visible, y compris pour les crawlers qui n'exécutent pas de JavaScript.
  root.classList.add('js');
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  } catch (e) {
    root.setAttribute('data-theme', 'dark');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
