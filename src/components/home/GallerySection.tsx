import { motion } from "framer-motion";
import galleryInterior from "@/assets/gallery-interior.jpg";
import galleryCabinets from "@/assets/gallery-cabinets.jpg";
import galleryExterior from "@/assets/gallery-exterior.jpg";

const projects = [
  { src: galleryInterior, alt: "Interior painting project in Orange County", label: "Interior Repaint" },
  { src: galleryCabinets, alt: "Cabinet painting project", label: "Cabinet Refinishing" },
  { src: galleryExterior, alt: "Exterior painting project", label: "Full Exterior" },
];

const GallerySection = () => (
  <section className="section-padding bg-card">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">Our Work</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Recent Projects</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-lg overflow-hidden"
          >
            <img src={p.src} alt={p.alt} loading="lazy" width={800} height={800} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
              <span className="font-body text-sm font-semibold text-primary-foreground">{p.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
