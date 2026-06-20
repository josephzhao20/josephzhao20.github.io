import { LinkButton } from '@/components/ui/Button';

export const metadata = { title: "Our Story — Winning With The Hunt" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">

      {/* Page header */}
      <div className="mb-12 border-b-2 border-ink pb-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-ink-soft">
          Brought to you by More 2 the Hunt
        </p>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Our Story</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Winning With The Hunt is where hunters, anglers, and outdoor families
          keep the stories worth remembering. Not just where it happened — what
          it meant. Every adventure tells a story. This is where it gets told.
        </p>
      </div>

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

      {/* The book */}
      <section className="mb-14 rounded-trail border-2 border-ink bg-white p-6 shadow-trail sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-stone text-4xl">
            📖
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-soft">The Book</p>
            <h2 className="font-display text-xl font-bold text-ink">Winning With The Wildlife</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Brian's book lays out the philosophy behind the hunt — how time in the
              outdoors builds the kind of character that carries over into every part of
              life. Goal-oriented, family-centered, and grounded in a deep respect for
              wildlife and wild places.
            </p>
            <div className="mt-4">
              <LinkButton href="https://more2thehunt.com" variant="ghost" size="sm">
                Get the book ↗
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* The show */}
      <section className="mb-14">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-soft">The Show</p>
        <h2 className="mb-4 font-display text-2xl font-bold text-ink">More 2 the Hunt</h2>
        <p className="mb-5 text-base leading-relaxed text-ink-soft">
          Watch the show that started it all. Season after season, Brian takes you into
          the field — not just for the shot, but for the story behind it.
        </p>
        <LinkButton href="https://youtube.com" variant="ghost" size="sm">
          Watch on YouTube ↗
        </LinkButton>
      </section>

      {/* Scholarship */}
      <section className="rounded-trail border-2 border-ink bg-forest/5 p-6 sm:p-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-forest">Community Impact</p>
        <h2 className="mb-3 font-display text-xl font-bold text-ink">
          Reagan Harvey Character Counts Scholarship
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Over $850,000 awarded to young people who demonstrate the kind of character
          Brian has always believed the outdoors builds. The scholarship honors Reagan
          Harvey and the belief that what you do when no one is watching is what matters
          most. Learn more about the program and how to apply.
        </p>
        <div className="mt-5">
          <LinkButton href="https://more2thehunt.com" variant="ghost" size="sm">
            Learn more ↗
          </LinkButton>
        </div>
      </section>

    </div>
  );
}
