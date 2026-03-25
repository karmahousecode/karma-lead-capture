import { motion } from "framer-motion";
import { Paintbrush, Home, PaintBucket, Wrench, Droplets, Shield, Hammer } from "lucide-react";

const services = [
  { icon: Paintbrush, title: "Interior Painting", desc: "Walls, ceilings, trim, and doors with meticulous prep and premium finishes." },
  { icon: Home, title: "Exterior Painting", desc: "Complete exterior painting that protects and transforms your home's curb appeal." },
  { icon: PaintBucket, title: "Cabinet Painting", desc: "Factory-quality cabinet finishes without the cost of full replacement." },
  { icon: Wrench, title: "Stucco Patch & Repair", desc: "Expert stucco repair and patching to restore your home's exterior surfaces." },
  { icon: Hammer, title: "Wood Repair", desc: "Damaged wood repair and replacement before painting for lasting results." },
  { icon: Droplets, title: "Power Washing", desc: "Thorough surface cleaning to prepare for painting or refresh your property." },
  { icon: Shield, title: "Surface Prep", desc: "Detailed scraping, sanding, priming, and caulking — the foundation of a great paint job." },
];

const ServicesSection = () => (
  <section className="section-padding bg-card">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">What We Do</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Services</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-lg border border-border bg-background hover:shadow-medium transition-shadow"
          >
            <svc.icon className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{svc.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
