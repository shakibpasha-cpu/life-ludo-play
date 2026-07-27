import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Gamepad2, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ludo.jpg";
import diceImage from "@/assets/dice.png";
import { trackEvent } from "@/lib/analytics";

const HeroSection = () => {
  const navigate = useNavigate();
  const scrollToBooking = () => {
    trackEvent("cta_book_click", { placement: "hero" });
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };
  const goToDemo = () => {
    trackEvent("cta_demo_click", { placement: "hero" });
    navigate("/play");
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-20">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroImage}
          preload="none"
          className="w-full h-full object-cover object-[center_40%]"
        >
          <source src="/videos/hero-ludo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/85 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_40%_at_50%_60%,hsl(var(--background)/0.8),transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Floating dice */}
      <motion.img
        src={diceImage}
        alt="Colorful dice"
        className="absolute top-24 right-4 sm:top-40 sm:right-10 w-14 h-14 sm:w-20 sm:h-20 md:w-32 md:h-32 opacity-80 pointer-events-none"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={diceImage}
        alt="Colorful dice"
        className="absolute bottom-24 left-4 sm:bottom-32 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 opacity-60 pointer-events-none"
        animate={{ y: [0, -15, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 backdrop-blur-md border border-border shadow-sm text-[11px] sm:text-xs font-body font-medium uppercase tracking-[0.16em] text-foreground/80 mb-7">
            <Dices className="w-3.5 h-3.5 text-primary" />
            Pakistan's Most Exciting Life-Size Game
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1.05] tracking-tight mb-5 sm:mb-7 [text-shadow:0_2px_24px_hsl(var(--background)/0.8)]"
        >
          Step Into The Game –{" "}
          <span className="text-gradient-ludo">Become The Ludo Piece!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto mb-9 sm:mb-11 leading-relaxed"
        >
          Experience the world's most exciting life-size Ludo game for families,
          corporate events, and celebrations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center"
        >
          <Button variant="hero" size="xl" onClick={scrollToBooking}>
            <CalendarCheck className="w-5 h-5" />
            Book Your Event
          </Button>
          <Button variant="heroOutline" size="xl" onClick={goToDemo}>
            <Gamepad2 className="w-5 h-5" />
            Try Live Demo
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
