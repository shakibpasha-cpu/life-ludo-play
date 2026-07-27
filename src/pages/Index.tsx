import { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import EventTypes from "@/components/EventTypes";
import BookingForm from "@/components/BookingForm";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SectionSkeleton from "@/components/SectionSkeleton";

const ShopSection = lazy(() => import("@/components/ShopSection"));
const Gallery = lazy(() => import("@/components/Gallery"));
const FunZone = lazy(() => import("@/components/FunZone"));
const LudoDemo = lazy(() => import("@/components/LudoDemo"));
const Testimonials = lazy(() => import("@/components/Testimonials"));

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <EventTypes />
        <Suspense fallback={<SectionSkeleton tiles={2} />}>
          <ShopSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton tiles={6} />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionSkeleton tiles={6} />}>
          <FunZone />
        </Suspense>
        <Suspense fallback={<SectionSkeleton tiles={1} />}>
          <LudoDemo />
        </Suspense>
        <Suspense fallback={<SectionSkeleton tiles={3} />}>
          <Testimonials />
        </Suspense>
        <BookingForm />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
