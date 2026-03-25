import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-home.jpg";

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImage} alt="Beautifully painted Orange County home" width={1920} height={1080} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-primary/30" />
    </div>

    <div className="relative container-wide px-5 md:px-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-4">
          Orange County's Premier Painters
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
          Painting Done{" "}
          <span className="text-gradient-gold">Right.</span>
        </h1>
        <p className="font-body text-base md:text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-md">
          We help homeowners who want more than builder-grade results. Expert preparation, premium materials, 
          and a finish that speaks for itself.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/estimate">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Request Free Estimate
            </Button>
          </Link>
          <a href="tel:+15555551234">
            <Button variant="hero-outline" size="xl" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Phone className="w-5 h-5" />
              Call Now
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
