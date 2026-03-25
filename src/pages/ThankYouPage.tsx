import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Home, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const ThankYouPage = () => (
  <>
    <Header />
    <main className="pt-20 min-h-screen bg-background flex items-center">
      <div className="container-narrow px-5 md:px-8 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Thank You!</h1>
          <p className="font-body text-base text-muted-foreground max-w-md mx-auto mb-3 leading-relaxed">
            We've received your estimate request. Here's what happens next:
          </p>
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto mb-8 text-left space-y-3">
            {[
              "We'll review your project details and photos",
              "We'll reach out within 1 business day to discuss your project",
              "We'll schedule a convenient time for an on-site estimate",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-xs font-bold text-accent-foreground shrink-0 mt-0.5">{i + 1}</span>
                <p className="font-body text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+19498364864">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                <Phone className="w-4 h-4" /> Call Now
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </>
);

export default ThankYouPage;
