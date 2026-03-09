import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-24 px-4" id="contact">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Get In <span className="text-gradient-ludo">Touch</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Phone, label: "Call Us", value: "+91 XXXXX XXXXX", href: "tel:+91XXXXXXXXXX" },
            { icon: MessageCircle, label: "WhatsApp", value: "Chat Now", href: "https://wa.me/91XXXXXXXXXX?text=Hi!%20I'm%20interested%20in%20Human%20Size%20Ludo" },
            { icon: Mail, label: "Email", value: "hello@humansizeludo.com", href: "mailto:hello@humansizeludo.com" },
            { icon: MapPin, label: "Location", value: "India", href: "#" },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center hover:border-primary/50 transition-all group"
            >
              <item.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-display font-bold mb-1">{item.label}</p>
              <p className="text-muted-foreground text-sm">{item.value}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
