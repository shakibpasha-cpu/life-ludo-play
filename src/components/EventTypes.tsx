import { motion } from "framer-motion";
import { Building2, Heart, GraduationCap, PartyPopper, Cake, TreePalm } from "lucide-react";

const events = [
  { icon: Building2, title: "Corporate Team Building", desc: "Energize your team with competitive fun", chip: "bg-ludo-blue/12 text-ludo-blue" },
  { icon: Heart, title: "Family Events", desc: "Bond with family over life-size play", chip: "bg-ludo-red/12 text-ludo-red" },
  { icon: PartyPopper, title: "Weddings", desc: "Make your celebration unforgettable", chip: "bg-ludo-yellow/15 text-ludo-yellow" },
  { icon: GraduationCap, title: "School Activities", desc: "Educational fun for students", chip: "bg-ludo-green/12 text-ludo-green" },
  { icon: TreePalm, title: "Festivals", desc: "The star attraction of any festival", chip: "bg-ludo-blue/12 text-ludo-blue" },
  { icon: Cake, title: "Birthday Parties", desc: "A party they'll never forget", chip: "bg-ludo-red/12 text-ludo-red" },
];

const EventTypes = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-secondary/30 border-y border-border/60" id="events">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="section-eyebrow mb-5">Use Cases</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Perfect For <span className="text-gradient-ludo">Every Event</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">Where will you bring the Ludo experience?</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group h-full rounded-2xl border border-border/70 bg-card p-7 md:p-8 card-lift"
            >
              <div className={`w-12 h-12 mb-5 rounded-xl flex items-center justify-center ${event.chip} transition-transform duration-300 group-hover:scale-110`}>
                <event.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg md:text-xl mb-2 leading-snug">{event.title}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypes;
