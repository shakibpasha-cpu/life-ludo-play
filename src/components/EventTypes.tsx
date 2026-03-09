import { motion } from "framer-motion";
import { Building2, Heart, GraduationCap, PartyPopper, Cake, TreePalm } from "lucide-react";

const events = [
  { icon: Building2, title: "Corporate Team Building", desc: "Energize your team with competitive fun", color: "bg-ludo-blue/10 border-ludo-blue/30" },
  { icon: Heart, title: "Family Events", desc: "Bond with family over life-size play", color: "bg-ludo-red/10 border-ludo-red/30" },
  { icon: PartyPopper, title: "Weddings", desc: "Make your celebration unforgettable", color: "bg-ludo-yellow/10 border-ludo-yellow/30" },
  { icon: GraduationCap, title: "School Activities", desc: "Educational fun for students", color: "bg-ludo-green/10 border-ludo-green/30" },
  { icon: TreePalm, title: "Festivals", desc: "The star attraction of any festival", color: "bg-ludo-blue/10 border-ludo-blue/30" },
  { icon: Cake, title: "Birthday Parties", desc: "A party they'll never forget", color: "bg-ludo-red/10 border-ludo-red/30" },
];

const EventTypes = () => {
  return (
    <section className="py-24 px-4 bg-secondary/30" id="events">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Perfect For <span className="text-gradient-ludo">Every Event</span>
          </h2>
          <p className="text-muted-foreground text-lg">Where will you bring the Ludo experience?</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`rounded-2xl border p-8 ${event.color} backdrop-blur-sm transition-all cursor-pointer`}
            >
              <event.icon className="w-12 h-12 mb-4 text-foreground" />
              <h3 className="font-display font-bold text-xl mb-2">{event.title}</h3>
              <p className="text-muted-foreground">{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypes;
