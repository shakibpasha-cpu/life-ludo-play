import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Dices, Sun, Moon } from "lucide-react";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Events", href: "#events" },
  { label: "Shop", href: "#shop" },
  { label: "Gallery", href: "#gallery" },
  { label: "Demo", href: "#demo" },
  { label: "Book Now", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return !document.documentElement.classList.contains("light");
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [dark]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-background/90 border-b border-border shadow-sm" : "bg-background/50 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg sm:text-xl tracking-tight transition-opacity hover:opacity-80">
          <Dices className="w-7 h-7 text-primary" />
          <span>Human Size <span className="text-primary">Ludo</span></span>
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7">
          {links.map(l => (
            <a key={l.label} href={l.href} className="link-underline text-sm whitespace-nowrap font-body">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full border border-border bg-secondary/70 hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-secondary"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-foreground" />}
          </button>
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-background border-b border-border px-4 pb-4 max-h-[70vh] overflow-y-auto"
        >
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-muted-foreground hover:text-foreground transition-colors font-body">
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
