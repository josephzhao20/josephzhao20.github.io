export function Footer({ showMapCredit = false }: { showMapCredit?: boolean }) {
  return (
    <footer className="bg-forest-dark py-10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-sm font-bold text-cream">Winning With The Hunt</p>
            <p className="mt-1 text-xs text-cream/60">Every adventure tells a story.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-cream/65">
            <a href="https://more2thehunt.com" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
              More 2 the Hunt ↗
            </a>
            <a
              href="https://www.amazon.com/WINNING-WILDLIFE-ACHIEVEMENT-OUTDOOR-BASED-GOAL-ORIENTED/dp/B0DPB7FJM1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              The Book ↗
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
              {/* TODO: replace with official YouTube channel URL */}
              Watch the Show ↗
            </a>
          </div>
        </div>
        {showMapCredit && (
          <div className="mt-8 border-t border-cream/10 pt-6 text-xs text-cream/40">
            Map data © OpenStreetMap contributors
          </div>
        )}
      </div>
    </footer>
  );
}
