import { motion } from "framer-motion";
import { Users, Dices, Footprints, Trophy, UserPlus, Sparkles } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Teams Are Formed", desc: "4 teams with equal players", color: "text-ludo-red", chip: "bg-ludo-red/10" },
  { icon: Users, title: "Become The Pieces", desc: "Players stand on the giant board", color: "text-ludo-blue", chip: "bg-ludo-blue/10" },
  { icon: Dices, title: "Roll The Giant Dice", desc: "A massive dice decides your fate", color: "text-ludo-green", chip: "bg-ludo-green/10" },
  { icon: Footprints, title: "Move On The Board", desc: "Walk across the giant Ludo board", color: "text-ludo-yellow", chip: "bg-ludo-yellow/10" },
  { icon: Trophy, title: "First Team Wins!", desc: "Race to finish and claim victory", color: "text-primary", chip: "bg-primary/10" },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-ludo-glow opacity-50" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="section-eyebrow mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            The Experience
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient-ludo">Works</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Five simple steps to the most exciting game you've ever played
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6 items-stretch">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card card-lift rounded-2xl p-6 pt-8 text-center relative group h-full"
            >
              <div className="absolute top-4 left-4 text-xs font-display font-bold tracking-widest text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center ${step.chip} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <h3 className="font-display font-bold text-base md:text-lg mb-2 leading-snug">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
