import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

const Index = () => (
  <>
    <Header />
    <main>
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <GallerySection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
