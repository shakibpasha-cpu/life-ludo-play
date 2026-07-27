import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const faqs = [
  {
    q: "What is the Human Size Ludo Experience?",
    a: "It is a real-life, life-size version of Ludo played on a 20x20 feet board where guests become the game pieces, roll a giant dice and move square by square. It is hosted by our team with music, referees and props.",
  },
  {
    q: "How much space do I need for a life-size Ludo setup?",
    a: "Our standard arena is 20x20 feet, so a clear indoor hall or outdoor lawn of roughly 25x25 feet is ideal. We also build custom sizes for smaller or larger venues.",
  },
  {
    q: "How many people can play at once?",
    a: "A single game runs with 4 teams and works best with 4 to 40 players. For larger events we run rotating rounds and can accommodate up to 2000 guests across the day.",
  },
  {
    q: "Which events is life-size Ludo suitable for?",
    a: "Corporate team building, weddings and mehndi nights, family gatherings, school and university activities, festivals, birthdays and mall activations.",
  },
  {
    q: "Do you deliver the Ludo game kit across Pakistan and worldwide?",
    a: "Yes. We deliver domestically anywhere in Pakistan via courier and ship internationally worldwide. Customised sizes, colours and branding are available.",
  },
  {
    q: "How do I book the Human Size Ludo Experience?",
    a: "Fill in the booking form on this page with your event date, preferred time slot and package, or message us on WhatsApp. We reply with a tailored quote, usually the same day.",
  },
];

const FAQSection = () => (
  <section className="py-20 md:py-28 px-4" id="faq">
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-14"
      >
        <span className="section-eyebrow mb-5">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          Frequently Asked <span className="text-gradient-ludo">Questions</span>
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">Everything about booking life-size Ludo in Pakistan</p>
      </motion.div>

      <Accordion type="single" collapsible className="glass-card rounded-2xl px-4 sm:px-6">
        {faqs.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-display text-base">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
