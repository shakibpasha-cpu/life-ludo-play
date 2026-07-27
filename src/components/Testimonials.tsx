import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Rajesh K.", role: "Corporate Event Manager", text: "The Human Size Ludo was the highlight of our annual team building event. Everyone loved it!", rating: 5 },
  { name: "Priya S.", role: "Wedding Planner", text: "Added this to a wedding reception and guests couldn't stop talking about it. Absolutely magical!", rating: 5 },
  { name: "Amit P.", role: "School Principal", text: "Our students had the best sports day ever. This game teaches teamwork in the most fun way.", rating: 5 },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            What People <span className="text-gradient-ludo">Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-display font-bold">{t.name}</p>
                <p className="text-muted-foreground text-sm">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
