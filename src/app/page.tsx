import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JobsSection from "@/components/JobsSection";
import CultureSection from "@/components/CultureSection";
import TeamsSection from "@/components/TeamsSection";
import ProcessSection from "@/components/ProcessSection";
import BenefitsSection from "@/components/BenefitsSection";
import FormSection from "@/components/FormSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <JobsSection />
      <CultureSection />
      <TeamsSection />
      <ProcessSection />
      <BenefitsSection />
      <FormSection />
      <FaqSection />
      <Footer />
      <ScrollToTop />
    </>
  );
}