import { LinkButton } from '@/components/ui/Button';

export const metadata = {
  title: "Our Mission — Winning With The Hunt",
  description: "Learn about Winning With The Hunt, the companion community for More 2 the Hunt. Built for hunters, anglers, and outdoor families who believe every adventure tells a story.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">

      {/* Page header */}
      <div className="mb-14">
        <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-rust">
          Brought to you by More 2 the Hunt
        </p>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Our Mission</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Winning With The Hunt is where hunters, anglers, and outdoor families
          keep the stories worth remembering. Not just where it happened — what
          it meant. Every adventure tells a story. This is where it gets told.
        </p>
      </div>

      {/* Pull quote */}
      <blockquote className="mb-14 border-l-4 border-rust pl-6">
        <p className="font-display text-xl font-bold italic leading-snug text-ink sm:text-2xl">
          "Hunting is about more than the trophy. It's about the people you bring with you,
          the lessons you carry home, and the wild places worth protecting."
        </p>
        <footer className="mt-3 text-sm font-bold text-ink-soft">— Brian, More 2 the Hunt</footer>
      </blockquote>

      {/* Brian's story */}
      <section className="mb-14">
        <h2 className="mb-5 font-display text-2xl font-bold text-ink">The man behind the hunt</h2>
        <div className="space-y-5 text-base leading-relaxed text-ink-soft">
          <p>
            Brian has been bowhunting since childhood — drawn to the outdoors not just for
            the harvest, but for what the pursuit teaches. Patience. Respect for the land.
            The kind of character that only gets built when you're miles from anyone who
            can help you.
          </p>
          <p>
            After a decade on Live 2 Hunt, Brian launched <strong className="text-ink">More 2 the Hunt</strong> — a show
            built on a simple belief: hunting is about more than the trophy. It's about
            the people you bring with you, the lessons you carry home, and the wild places
            worth protecting for the next generation.
          </p>
          <p>
            Winning With The Hunt is the community that grew out of that belief. A place
            to share the real stories — the ones that don't fit in a highlight reel, but
            the ones that actually stick.
          </p>
        </div>
      </section>

      {/* Divider */}
      <hr className="mb-14 border-stone/30" />

      {/* The book */}
      <section className="mb-14 overflow-hidden rounded-card bg-white shadow-card-lg">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center rounded-card bg-forest/10 text-4xl">
            📖
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rust">The Book</p>
            <h2 className="font-display text-xl font-bold text-ink">Winning With The Wild Life</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Brian's book lays out the philosophy behind the hunt — how time in the
              outdoors builds the kind of character that carries over into every part of
              life. Goal-oriented, family-centered, and grounded in a deep respect for
              wildlife and wild places.
            </p>
            <div className="mt-4">
              <LinkButton href="https://www.amazon.com/WINNING-WILDLIFE-ACHIEVEMENT-OUTDOOR-BASED-GOAL-ORIENTED/dp/B0DPB7FJM1" variant="secondary" size="sm">
                Get the book ↗
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* The show */}
      <section className="mb-14 overflow-hidden rounded-card bg-white shadow-card-lg">
        <div className="p-6 sm:p-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rust">The Show</p>
          <h2 className="mb-3 font-display text-xl font-bold text-ink">More 2 the Hunt</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Season after season, Brian takes you into the field — not just for the shot,
            but for the story behind it.
          </p>
          <div className="mt-4">
            <LinkButton href="https://www.youtube.com/@More2TheHunt" variant="secondary" size="sm">
              Watch on YouTube ↗
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="mb-14 border-stone/30" />

      {/* Scholarship — stat callout */}
      <section className="overflow-hidden rounded-card bg-forest shadow-card-lg">
        <div className="p-6 sm:p-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-[3px] text-cream/60">Community Impact</p>
          <h2 className="font-display text-xl font-bold text-cream">
            Reagan Harvey Character Counts Scholarship
          </h2>

          {/* Stat callout */}
          <div className="my-6 inline-block rounded-card bg-cream/10 px-6 py-4">
            <p className="font-display text-4xl font-bold text-cream">$850,000+</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-cream/60">awarded to date</p>
          </div>

          <p className="text-sm leading-relaxed text-cream/75">
            Awarded to young people who demonstrate the kind of character Brian has always
            believed the outdoors builds. The scholarship honors Reagan Harvey and the belief
            that what you do when no one is watching is what matters most.
          </p>
          <div className="mt-5">
            <LinkButton href="https://more2thehunt.com" size="sm" className="border border-cream/30 bg-cream/10 text-cream hover:bg-cream/20">
              Learn more ↗
            </LinkButton>
          </div>
        </div>
      </section>

    </div>
  );
}
