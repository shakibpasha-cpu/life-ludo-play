import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import EventTypes from "@/components/EventTypes";
import Gallery from "@/components/Gallery";
import FunZone from "@/components/FunZone";
import LudoDemo from "@/components/LudoDemo";
import Testimonials from "@/components/Testimonials";
import BookingForm from "@/components/BookingForm";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <EventTypes />
        <Gallery />
        <LudoDemo />
        <Testimonials />
        <BookingForm />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
