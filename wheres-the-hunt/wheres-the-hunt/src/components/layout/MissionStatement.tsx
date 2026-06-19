import { TopoDivider } from '@/components/ui/TopoLines';

export function MissionStatement() {
  return (
    <section className="border-b-2 border-ink bg-earth/10 py-16">
      <TopoDivider className="mx-auto mb-10 h-6 w-full max-w-3xl text-earth/60" />
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Our mission</h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Where&rsquo;s The Hunt? is a community-driven map of adventures,
          memories, and places worth remembering. From family vacations and
          national parks to fishing trips and hidden gems, every pin
          represents a story waiting to be explored.
        </p>
      </div>
    </section>
  );
}
