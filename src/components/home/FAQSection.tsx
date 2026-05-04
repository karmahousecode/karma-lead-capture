import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "How long does painting take?", a: "Most interior projects take 2–5 days depending on the size of the home and scope of prep work. Exterior projects can take 3–7 days. We'll provide a clear timeline with your estimate so you know exactly what to expect." },
  { q: "Do you serve Irvine and Orange County?", a: "Yes — we serve Irvine and all of Orange County, California. We've been working with local homeowners since 2001 and are familiar with the styles, materials, and conditions common to homes throughout the area." },
  { q: "Do you repair drywall or stucco before painting?", a: "Yes. Drywall patches, ceiling repairs, texture matching, and stucco repair are all part of what we do before painting. We handle everything in-house so the finished surface looks seamless and holds up long-term." },
  { q: "Do you help with prep and repairs?", a: "Absolutely. In fact, preparation is where we spend the most time because it's the foundation of a great paint job. We handle patching, sanding, caulking, priming, wood repair, and stucco repair before any paint goes on the wall." },
  { q: "Do you paint kitchen cabinets?", a: "Yes — cabinet painting and refinishing is one of our specialties. We use professional spray techniques and premium coatings to achieve a factory-quality finish at a fraction of the cost of replacing your cabinets." },
  { q: "What makes Karma House Painting different from cheaper painters?", a: "We focus on prep first — patching, sanding, caulking, priming — before a drop of paint goes on. We use premium materials, employ a skilled crew (not day laborers), and our owner is involved on every job. The difference shows in how long the finish lasts." },
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
