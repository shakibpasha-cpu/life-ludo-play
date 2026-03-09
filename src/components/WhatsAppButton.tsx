import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/91XXXXXXXXXX?text=Hi!%20I'm%20interested%20in%20booking%20Human%20Size%20Ludo%20for%20my%20event"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-ludo-green flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-foreground" />
    </a>
  );
};

export default WhatsAppButton;
