export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-cream py-8">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-display text-sm font-bold text-ink">Winning With The Hunt</p>
            <p className="mt-0.5 text-xs font-semibold text-ink-soft">Every adventure tells a story.</p>
          </div>
          <div className="flex items-center gap-5 text-xs font-bold text-ink-soft">
            <a href="https://more2thehunt.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              More 2 the Hunt ↗
            </a>
            <a href="https://more2thehunt.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              The Book ↗
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              Watch the Show ↗
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-soft sm:text-right">
          Map data &copy; OpenStreetMap contributors
        </p>
      </div>
    </footer>
  );
}
