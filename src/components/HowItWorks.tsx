import { motion } from "framer-motion";
import { Users, Dices, Footprints, Trophy, UserPlus } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Teams Are Formed", desc: "4 teams with equal players", color: "text-ludo-red" },
  { icon: Users, title: "Become The Pieces", desc: "Players stand on the giant board", color: "text-ludo-blue" },
  { icon: Dices, title: "Roll The Giant Dice", desc: "A massive dice decides your fate", color: "text-ludo-green" },
  { icon: Footprints, title: "Move On The Board", desc: "Walk across the giant Ludo board", color: "text-ludo-yellow" },
  { icon: Trophy, title: "First Team Wins!", desc: "Race to finish and claim victory", color: "text-primary" },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-ludo-glow opacity-50" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient-ludo">Works</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Five simple steps to the most exciting game you've ever played
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-6 text-center relative group hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                {i + 1}
              </div>
              <step.icon className={`w-10 h-10 mx-auto mb-4 ${step.color} group-hover:scale-110 transition-transform`} />
              <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
