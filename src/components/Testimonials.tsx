import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Rajesh K.", role: "Corporate Event Manager", text: "The Human Size Ludo was the highlight of our annual team building event. Everyone loved it!", rating: 5 },
  { name: "Priya S.", role: "Wedding Planner", text: "Added this to a wedding reception and guests couldn't stop talking about it. Absolutely magical!", rating: 5 },
  { name: "Amit P.", role: "School Principal", text: "Our students had the best sports day ever. This game teaches teamwork in the most fun way.", rating: 5 },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="section-eyebrow mb-5">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            What People <span className="text-gradient-ludo">Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card card-lift rounded-2xl p-6 sm:p-8 h-full flex flex-col relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/15" />
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 mb-7 leading-relaxed flex-1">“{t.text}”</p>
              <div className="flex items-center gap-3 pt-5 border-t border-border/60">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-display font-bold flex items-center justify-center shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
