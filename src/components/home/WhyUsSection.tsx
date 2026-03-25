import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const reasons = [
  { title: "Experienced Workmanship", desc: "Years of hands-on painting experience delivering consistent, beautiful results." },
  { title: "Detailed Prep", desc: "We never cut corners on preparation — it's the most important step." },
  { title: "Professional Finish", desc: "Smooth, even coats with clean lines and attention to every detail." },
  { title: "Clear Scope of Work", desc: "You know exactly what's included before we start — no surprises." },
  { title: "Honest Communication", desc: "We keep you informed at every step and respond promptly." },
];

const WhyUsSection = () => (
  <section className="section-padding bg-background">
    <div className="container-wide">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">The Difference</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Why Homeowners Choose Us</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4"
          >
            <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{r.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUsSection;
