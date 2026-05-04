import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const TestimonialsSection = () => (
  <section className="section-padding bg-background">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">Testimonials</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Read Our Orange County Customer Reviews
        </h2>
        <p className="font-body text-base text-muted-foreground max-w-lg mx-auto mb-8">
          We let our work and our customers speak for us. Check out verified reviews from real homeowners in Orange
          County.
        </p>
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="w-6 h-6 fill-accent text-accent" />
          ))}
        </div>
        <a href="https://www.karmahouse.com#testimonial" target="_blank" rel="noopener noreferrer">
          <Button variant="gold" size="lg">
            <ExternalLink className="w-4 h-4" />
            Read Our Google Reviews
          </Button>
        </a>
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
