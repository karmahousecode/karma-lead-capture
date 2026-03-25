import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="section-padding bg-primary">
    <div className="container-narrow text-center px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Ready for a{" "}
          <span className="text-gradient-gold">Beautiful Finish?</span>
        </h2>
        <p className="font-body text-base text-primary-foreground/70 mb-8 max-w-md mx-auto">
          Tell us about your project and we'll provide a detailed, no-obligation estimate.
        </p>
        <Link to="/estimate">
          <Button variant="hero" size="xl">
            Request Your Free Estimate
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
