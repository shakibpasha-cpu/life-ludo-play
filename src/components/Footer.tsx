import { Dices, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl mb-4">
              <Dices className="w-6 h-6 text-primary" />
              <span>Human Size Ludo</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pakistan's most exciting life-size Ludo game experience for families, corporates, and celebrations.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {["How It Works", "Events", "Gallery", "Book Now", "Contact"].map(link => (
                <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {["Human Size Ludo", "Life Size Ludo Game", "Event Entertainment", "Corporate Team Building", "Family Fun Game"].map(kw => (
                <span key={kw} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{kw}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-between text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
          <span>© {new Date().getFullYear()} Human Size Ludo Experience. All rights reserved.</span>
          <Link to="/admin" className="flex items-center gap-1.5 hover:text-foreground transition-colors text-xs">
            <Lock className="w-3 h-3" /> Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
