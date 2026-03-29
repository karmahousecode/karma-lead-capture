import { motion } from "framer-motion";
import { ExternalLink, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";

const GallerySection = () => (
  <section className="section-padding bg-card">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">Our Work</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Real Projects</h2>
        <div className="flex justify-center mb-6">
          <Paintbrush className="w-12 h-12 text-accent" />
        </div>
        <p className="font-body text-base text-muted-foreground max-w-lg mx-auto mb-8">
          View our recent work and transformations on our website. From interior repaints to full exterior projects, see
          the quality difference for yourself.
        </p>
        <a href="https://www.karmahouse.com#gallery" target="_blank" rel="noopener noreferrer">
          <Button variant="gold" size="lg">
            <ExternalLink className="w-4 h-4" />
            View Our Projects
          </Button>
        </a>
      </motion.div>
    </div>
  </section>
);

export default GallerySection;
