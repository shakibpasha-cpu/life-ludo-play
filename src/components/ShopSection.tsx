import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Truck, Globe, Package, Ruler, Palette, MessageCircle, Check } from "lucide-react";
import ludoBoard from "@/assets/ludo-board.jpeg";
import { trackEvent } from "@/lib/analytics";

const features = [
  { icon: Ruler, label: "Default Size", value: "20 × 20 feet" },
  { icon: Palette, label: "Custom Sizes", value: "Available on request" },
  { icon: Truck, label: "Domestic", value: "All over Pakistan" },
  { icon: Globe, label: "International", value: "Worldwide via courier" },
];

const ShopSection = () => {
  const [selectedSize, setSelectedSize] = useState("20x20");
  const [customNote, setCustomNote] = useState("");

  const sizes = [
    { id: "20x20", label: "20 × 20 ft", tag: "Standard", price: "Contact for Price" },
    { id: "custom", label: "Custom Size", tag: "Tailored", price: "Get a Quote" },
  ];

  const handleOrderNow = () => {
    const sizeLabel = sizes.find(s => s.id === selectedSize)?.label || "20 × 20 ft";
    const message = `Hi! I'd like to order a Life-Size Ludo Game Kit.\n\n📏 Size: ${sizeLabel}\n${customNote ? `📝 Note: ${customNote}\n` : ""}\nPlease share pricing and delivery details.`;
    trackEvent("shop_order_click", { size: sizeLabel, has_note: Boolean(customNote) });
    window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-secondary/20 border-y border-border/60" id="shop">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="section-eyebrow mb-5">
            <ShoppingCart className="w-3.5 h-3.5 text-primary" />
            Shop
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Get Your <span className="text-gradient-ludo">Ludo Game Kit</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Own the ultimate life-size Ludo game experience — delivered to your doorstep anywhere in Pakistan or worldwide!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-10 items-start">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-lift)" }}>
              <img
                src={ludoBoard}
                alt="Human Size Ludo Board - 20x20 feet"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-3 right-2 sm:-bottom-4 sm:-right-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 sm:px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm shadow-lg">
              <Package className="w-4 h-4" />
              Life-Size Board
            </div>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-background border border-border min-w-0 transition-colors hover:border-primary/40"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="text-sm font-bold text-foreground break-words">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-display font-bold text-foreground mb-3">
                Select Size
              </label>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selectedSize === size.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40"
                    }`}
                  >
                    {selectedSize === size.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{size.tag}</span>
                    <p className="font-display font-bold text-foreground">{size.label}</p>
                    <p className="text-xs text-primary font-bold mt-1">{size.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Note */}
            {selectedSize === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-sm font-display font-bold text-foreground mb-2">
                  Customization Details
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Describe your custom size, design preferences, colors, etc."
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </motion.div>
            )}

            {/* What's Included */}
            <div className="p-4 rounded-xl bg-background border border-border">
              <p className="text-sm font-display font-bold text-foreground mb-2">What's Included:</p>
              <ul className="space-y-1.5">
                {[
                  "Premium quality Ludo board mat",
                  "Giant dice & game tokens",
                  "Setup instructions guide",
                  "Secure packaging & courier delivery",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrderNow}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_18px_38px_-14px_hsl(var(--primary)/0.9)] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Chat with us for pricing, bulk orders &amp; custom designs
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
