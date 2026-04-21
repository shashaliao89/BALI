import { BookingModule } from "@/components/booking-module";
import { FloatingContact } from "@/components/floating-contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { GuidesIntro } from "@/components/guides-intro";
import { ItineraryDetails } from "@/components/itinerary-details";
import { KeyExperiences } from "@/components/key-experiences";
import { SoulCall } from "@/components/soul-call";
import { WarmReminder } from "@/components/warm-reminder";

export default function Home() {
  return (
    <>
      <Hero />
      <SoulCall />
      <KeyExperiences />
      <GuidesIntro />
      <ItineraryDetails />
      <BookingModule />
      <WarmReminder />
      <Footer />
      <FloatingContact />
    </>
  );
}
