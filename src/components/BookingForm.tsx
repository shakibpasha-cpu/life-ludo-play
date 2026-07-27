import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Gamepad2, AlertCircle, Check, Sun, Sunset, Moon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const eventTypes = ["Corporate Team Building", "Family Event", "Wedding", "School Activity", "Festival", "Birthday Party"];

const timeSlots = [
  { value: "Morning (9 AM – 12 PM)", label: "Morning", hint: "9 AM – 12 PM", icon: Sun },
  { value: "Afternoon (12 PM – 5 PM)", label: "Afternoon", hint: "12 PM – 5 PM", icon: Sunset },
  { value: "Evening (5 PM – 10 PM)", label: "Evening", hint: "5 PM – 10 PM", icon: Moon },
];

const packages = [
  { value: "Essential", label: "Essential", price: "Starter", points: ["20×20 ft Ludo arena", "1 host & referee", "2 hours of play"] },
  { value: "Signature", label: "Signature", price: "Most Popular", points: ["20×20 ft arena + props", "2 hosts, music & mic", "4 hours + photo coverage"] },
  { value: "Grand", label: "Grand", price: "Premium", points: ["Custom-size arena", "Full event crew & décor", "Full day + video highlights"] },
];

const todayISO = new Date().toISOString().split("T")[0];

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100, "Name must be under 100 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits, spaces, +, - and ()"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
  city: z.string().trim().max(80, "City must be under 80 characters").optional().or(z.literal("")),
  eventType: z.string().min(1, "Choose the type of event"),
  eventDate: z
    .string()
    .min(1, "Pick a date for your event")
    .refine((d) => d >= todayISO, "Event date cannot be in the past"),
  eventTime: z.string().min(1, "Select a preferred time slot"),
  packageName: z.string().min(1, "Select a package"),
  participants: z
    .string()
    .min(1, "Tell us how many people are joining")
    .refine((v) => Number(v) >= 4 && Number(v) <= 2000, "Enter a number between 4 and 2000"),
  message: z.string().trim().max(1000, "Message must be under 1000 characters").optional().or(z.literal("")),
});

type BookingFields = z.infer<typeof bookingSchema>;
type FieldErrors = Partial<Record<keyof BookingFields, string>>;

const emptyForm: BookingFields = {
  name: "", phone: "", email: "", city: "", eventType: "", eventDate: "", eventTime: "", packageName: "", participants: "", message: "",
};

const BookingForm = () => {
  const [form, setForm] = useState<BookingFields>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [startTracked, setStartTracked] = useState(false);

  const trackStart = (field: string) => {
    if (startTracked) return;
    setStartTracked(true);
    trackEvent("booking_form_start", { field });
  };

  const setField = (name: keyof BookingFields, value: string) => {
    trackStart(name);
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setField(e.target.name as keyof BookingFields, e.target.value);
  };

  const validateField = (name: keyof BookingFields) => {
    const result = bookingSchema.safeParse(form);
    if (result.success) return;
    const issue = result.error.issues.find((i) => i.path[0] === name);
    if (issue) setErrors((prev) => ({ ...prev, [name]: issue.message }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BookingFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      document.querySelector<HTMLElement>("[data-field-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const data = result.data;
    setSubmitting(true);

    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city || null,
      event_type: data.eventType,
      event_date: data.eventDate,
      event_time: data.eventTime,
      package: data.packageName,
      participants: parseInt(data.participants),
      message: data.message || null,
      source: "website",
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    toast.success("Thank you! We'll get back to you shortly 🎲");
    trackEvent("booking_submitted", {
      event_type: data.eventType,
      city: data.city || null,
      event_time: data.eventTime,
      package: data.packageName,
    });
    setForm(emptyForm);
    setErrors({});
    setSubmitting(false);
  };

  const FieldError = ({ name }: { name: keyof BookingFields }) =>
    errors[name] ? (
      <p data-field-error="true" className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        {errors[name]}
      </p>
    ) : null;

  const inputClass = (name: keyof BookingFields) =>
    cn("bg-background/50 border-border h-12", errors[name] && "border-destructive focus-visible:ring-destructive");

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
