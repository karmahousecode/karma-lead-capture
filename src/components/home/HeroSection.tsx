import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Camera } from "lucide-react";
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
          Irvine &amp; Orange County Painting Contractor
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
          Professional Painting Done{" "}
          <span className="text-gradient-gold">Right.</span>
        </h1>
        <p className="font-body text-base md:text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-md">
          Interior painting, exterior painting, cabinet refinishing, stucco repair, drywall repair, and wood repair for Orange County homeowners.
        </p>
        <div className="flex flex-col gap-3 sm:max-w-sm">
          <Link to="/estimate">
            <Button variant="hero" size="xl" className="w-full">
              Start Your Free Estimate
            </Button>
          </Link>
          <Link to="/estimate">
            <Button variant="hero-outline" size="xl" className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Camera className="w-5 h-5" />
              Upload Photos for Fast Quote
            </Button>
          </Link>
        </div>
        <p className="font-body text-sm text-primary-foreground/70 mt-4">
          Takes less than 2 minutes. No obligation.
        </p>
        <p className="font-body text-xs text-primary-foreground/50 mt-2">
          Serving Orange County since 2001 • Owner-operated • Detailed prep • Premium finishes
        </p>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
