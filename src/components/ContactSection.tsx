import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20 md:py-28 px-4" id="contact">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="section-eyebrow mb-5">Contact</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Get In <span className="text-gradient-ludo">Touch</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">We usually reply within a few hours</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Phone, label: "Call Us", value: "+91 XXXXX XXXXX", href: "tel:+91XXXXXXXXXX" },
            { icon: MessageCircle, label: "WhatsApp", value: "Chat Now", href: "https://wa.me/91XXXXXXXXXX?text=Hi!%20I'm%20interested%20in%20Human%20Size%20Ludo" },
            { icon: Mail, label: "Email", value: "hello@humansizeludo.com", href: "mailto:hello@humansizeludo.com" },
            { icon: MapPin, label: "Location", value: "Pakistan", href: "#" },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card card-lift rounded-2xl p-6 sm:p-7 text-center group break-words"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-display font-bold mb-1 text-sm">{item.label}</p>
              <p className="text-muted-foreground text-sm">{item.value}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
