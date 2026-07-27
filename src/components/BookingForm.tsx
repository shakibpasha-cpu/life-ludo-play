import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const eventTypes = ["Corporate Team Building", "Family Event", "Wedding", "School Activity", "Festival", "Birthday Party"];

const BookingForm = () => {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", eventType: "", eventDate: "", participants: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in required fields");
      return;
    }
    setSubmitting(true);

    const { error } = await supabase.from("leads").insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city || null,
      event_type: form.eventType || null,
      event_date: form.eventDate || null,
      participants: form.participants ? parseInt(form.participants) : null,
      message: form.message || null,
      source: "website",
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    toast.success("Thank you! We'll get back to you shortly 🎲");
    setForm({ name: "", phone: "", email: "", city: "", eventType: "", eventDate: "", participants: "", message: "" });
    setSubmitting(false);
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-secondary/30 border-y border-border/60" id="booking">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="section-eyebrow mb-5">Booking</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Book Your <span className="text-gradient-ludo">Experience</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">Fill in the details and we'll create magic for your event</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-6 sm:p-9 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <Input name="name" placeholder="Your Name *" value={form.name} onChange={handleChange} className="bg-background/50 border-border h-12" required />
            <Input name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} className="bg-background/50 border-border h-12" required />
            <Input name="email" type="email" placeholder="Email *" value={form.email} onChange={handleChange} className="bg-background/50 border-border h-12" required />
            <Input name="city" placeholder="City" value={form.city} onChange={handleChange} className="bg-background/50 border-border h-12" />
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-border bg-background/50 px-3 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Input name="eventDate" type="date" placeholder="Event Date" value={form.eventDate} onChange={handleChange} className="bg-background/50 border-border h-12" />
            <Input name="participants" type="number" placeholder="Number of Participants" value={form.participants} onChange={handleChange} className="bg-background/50 border-border h-12" />
          </div>
          <Textarea name="message" placeholder="Tell us about your event..." value={form.message} onChange={handleChange} className="bg-background/50 border-border min-h-[100px]" />
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={submitting}>
              {submitting ? "Submitting..." : (<><CalendarCheck className="w-5 h-5" />Request Quote</>)}
            </Button>
            <Button type="button" variant="heroOutline" size="lg" className="flex-1" onClick={() => {
              toast.info("Demo booking request sent!");
            }}>
              <Gamepad2 className="w-5 h-5" />
              Book Demo
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
