import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-wide section-padding">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-xl font-bold mb-3">
            Karma <span className="text-gradient-gold">House Painting</span>
          </h3>
          <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
            Premium residential painting services in Orange County, California. Quality craftsmanship and
            professional results for homeowners who expect the best.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="font-body text-sm text-primary-foreground/70 hover:text-accent transition-colors">Home</Link>
            <Link to="/estimate" className="font-body text-sm text-primary-foreground/70 hover:text-accent transition-colors">Request Estimate</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold mb-3">Contact</h4>
          <div className="flex flex-col gap-3">
            <a href="tel:+15555551234" className="flex items-center gap-2 font-body text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              <Phone className="w-4 h-4 text-accent" /> (555) 555-1234
            </a>
            <a href="mailto:info@karmahousepainting.com" className="flex items-center gap-2 font-body text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              <Mail className="w-4 h-4 text-accent" /> info@karmahousepainting.com
            </a>
            <div className="flex items-center gap-2 font-body text-sm text-primary-foreground/70">
              <MapPin className="w-4 h-4 text-accent shrink-0" /> Serving Orange County, CA
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center">
        <p className="font-body text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Karma House Painting. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
