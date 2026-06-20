import { TopoDivider } from '@/components/ui/TopoLines';

export function MissionStatement() {
  return (
    <section className="bg-forest py-20">
      <TopoDivider className="mx-auto mb-10 h-5 w-full max-w-3xl text-cream/15" />
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">Our Mission</h2>
        <p className="mt-5 text-base leading-relaxed text-cream/60 sm:text-lg">
          Winning With The Hunt is where hunters, anglers, and outdoor families
          keep the stories worth remembering. Not just where it happened — what
          it meant. Every adventure tells a story. This is where it gets told.
        </p>
      </div>
    </section>
  );
}
