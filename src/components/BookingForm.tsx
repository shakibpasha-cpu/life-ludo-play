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
          className="glass-card rounded-2xl p-6 sm:p-9 space-y-7"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <Label htmlFor="bf-name" className="mb-2 block text-sm">Your Name *</Label>
              <Input id="bf-name" name="name" placeholder="e.g. Ayesha Khan" value={form.name} onChange={handleChange} onBlur={() => validateField("name")} aria-invalid={!!errors.name} className={inputClass("name")} />
              <FieldError name="name" />
            </div>
            <div>
              <Label htmlFor="bf-phone" className="mb-2 block text-sm">Phone Number *</Label>
              <Input id="bf-phone" name="phone" inputMode="tel" placeholder="e.g. +92 300 1234567" value={form.phone} onChange={handleChange} onBlur={() => validateField("phone")} aria-invalid={!!errors.phone} className={inputClass("phone")} />
              <FieldError name="phone" />
            </div>
            <div>
              <Label htmlFor="bf-email" className="mb-2 block text-sm">Email *</Label>
              <Input id="bf-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} onBlur={() => validateField("email")} aria-invalid={!!errors.email} className={inputClass("email")} />
              <FieldError name="email" />
            </div>
            <div>
              <Label htmlFor="bf-city" className="mb-2 block text-sm">City</Label>
              <Input id="bf-city" name="city" placeholder="e.g. Lahore" value={form.city} onChange={handleChange} onBlur={() => validateField("city")} aria-invalid={!!errors.city} className={inputClass("city")} />
              <FieldError name="city" />
            </div>
            <div>
              <Label htmlFor="bf-type" className="mb-2 block text-sm">Event Type *</Label>
              <select
                id="bf-type"
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                onBlur={() => validateField("eventType")}
                aria-invalid={!!errors.eventType}
                className={cn(
                  "h-12 w-full rounded-lg border border-border bg-background/50 px-3 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  errors.eventType && "border-destructive focus:ring-destructive"
                )}
              >
                <option value="">Select event type</option>
                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FieldError name="eventType" />
            </div>
            <div>
              <Label htmlFor="bf-date" className="mb-2 block text-sm">Event Date *</Label>
              <Input id="bf-date" name="eventDate" type="date" min={todayISO} value={form.eventDate} onChange={handleChange} onBlur={() => validateField("eventDate")} aria-invalid={!!errors.eventDate} className={inputClass("eventDate")} />
              <FieldError name="eventDate" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bf-participants" className="mb-2 block text-sm">Number of Participants *</Label>
              <Input id="bf-participants" name="participants" type="number" min={4} max={2000} placeholder="e.g. 40" value={form.participants} onChange={handleChange} onBlur={() => validateField("participants")} aria-invalid={!!errors.participants} className={inputClass("participants")} />
              <p className="text-xs text-muted-foreground mt-1.5">Minimum 4 players — we scale up to 2000 guests.</p>
              <FieldError name="participants" />
            </div>
          </div>

          <div>
            <Label className="mb-1 block text-sm">Preferred Time Slot *</Label>
            <p className="text-xs text-muted-foreground mb-3">Pick when you'd like the arena set up.</p>
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
              {timeSlots.map(({ value, label, hint, icon: Icon }) => {
                const active = form.eventTime === value;
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setField("eventTime", value)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-smooth hover:border-primary/60",
                      active ? "border-primary bg-primary/10 shadow-soft" : "border-border bg-background/40",
                      errors.eventTime && !active && "border-destructive/60"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mb-2", active ? "text-primary" : "text-muted-foreground")} />
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{hint}</div>
                  </button>
                );
              })}
            </div>
            <FieldError name="eventTime" />
          </div>

          <div>
            <Label className="mb-1 block text-sm">Choose a Package *</Label>
            <p className="text-xs text-muted-foreground mb-3">Every package is customisable — this just helps us quote faster.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {packages.map((pkg) => {
                const active = form.packageName === pkg.value;
                return (
                  <button
                    type="button"
                    key={pkg.value}
                    onClick={() => setField("packageName", pkg.value)}
                    aria-pressed={active}
                    className={cn(
                      "relative rounded-xl border p-4 text-left transition-smooth hover:border-primary/60",
                      active ? "border-primary bg-primary/10 shadow-soft" : "border-border bg-background/40",
                      errors.packageName && !active && "border-destructive/60"
                    )}
                  >
                    {active && <Check className="absolute top-3 right-3 w-4 h-4 text-primary" />}
                    <div className="font-display font-bold">{pkg.label}</div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">{pkg.price}</div>
                    <ul className="space-y-1">
                      {pkg.points.map((p) => (
                        <li key={p} className="text-xs text-muted-foreground leading-snug">• {p}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
            <FieldError name="packageName" />
          </div>

          <div>
            <Label htmlFor="bf-message" className="mb-2 block text-sm">Anything else?</Label>
            <Textarea id="bf-message" name="message" placeholder="Tell us about your venue, theme or special requests..." value={form.message} onChange={handleChange} onBlur={() => validateField("message")} maxLength={1000} className={cn("bg-background/50 border-border min-h-[100px]", errors.message && "border-destructive")} />
            <div className="flex justify-between mt-1.5">
              <FieldError name="message" />
              <span className="text-xs text-muted-foreground ml-auto">{form.message?.length ?? 0}/1000</span>
            </div>
          </div>

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
