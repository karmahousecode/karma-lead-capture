import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", location: "Irvine, CA", text: "Karma House Painting transformed our home. The prep work was incredibly thorough and the finished product is flawless. Worth every penny." },
  { name: "David & Lisa K.", location: "Newport Beach, CA", text: "We've used other painters before but nobody comes close to this level of professionalism. Clear communication from start to finish." },
  { name: "Michael R.", location: "Laguna Niguel, CA", text: "Our cabinet refinishing looks like a factory finish. The attention to detail is unmatched. Highly recommend for anyone wanting quality work." },
];

const TestimonialsSection = () => (
  <section className="section-padding bg-background">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">Testimonials</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Our Clients Say</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
            <div>
              <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
              <p className="font-body text-xs text-muted-foreground">{t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
