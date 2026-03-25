import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "How long does painting take?", a: "Most interior projects take 2–5 days depending on the size of the home and scope of prep work. Exterior projects can take 3–7 days. We'll provide a clear timeline with your estimate so you know exactly what to expect." },
  { q: "Do you help with prep and repairs?", a: "Absolutely. In fact, preparation is where we spend the most time because it's the foundation of a great paint job. We handle patching, sanding, caulking, priming, wood repair, and stucco repair before any paint goes on the wall." },
  { q: "Do you offer cabinet painting?", a: "Yes — cabinet painting is one of our specialties. We use professional spray techniques and premium coatings to achieve a factory-quality finish at a fraction of the cost of replacing your cabinets." },
  { q: "Do you provide free estimates?", a: "Yes, all estimates are free with no obligation. We'll visit your property, discuss your vision, inspect the surfaces, and provide a detailed written scope of work with transparent pricing." },
];

const FAQSection = () => (
  <section className="section-padding bg-card">
    <div className="container-narrow px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-accent mb-2">FAQ</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Common Questions</h2>
      </motion.div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="font-body text-left text-base font-medium text-foreground">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
