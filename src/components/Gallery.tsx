import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-ludo.jpg";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const fallbackItems: GalleryItem[] = [
  { id: "1", src: heroImage, category: "Family Events", title: "Family Fun Day" } as any,
  { id: "2", src: heroImage, category: "Corporate Events", title: "Team Building Session" } as any,
  { id: "3", src: heroImage, category: "School Events", title: "School Sports Day" } as any,
  { id: "4", src: heroImage, category: "Festivals", title: "Festival Entertainment" } as any,
  { id: "5", src: heroImage, category: "Family Events", title: "Weekend Gaming" } as any,
  { id: "6", src: heroImage, category: "Corporate Events", title: "Office Party" } as any,
].map(item => ({ ...item, image_url: item.src || heroImage }));

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>(fallbackItems);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("gallery_items")
        .select("id, title, category, image_url")
        .eq("visible", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setItems(data as GalleryItem[]);
        const cats = ["All", ...Array.from(new Set(data.map((d: any) => d.category)))];
        setCategories(cats);
      } else {
        const cats = ["All", ...Array.from(new Set(fallbackItems.map(d => d.category)))];
        setCategories(cats);
      }
    };
    fetchGallery();
  }, []);

  const filtered = active === "All" ? items : items.filter(g => g.category === active);

  return (
    <section className="py-24 px-4" id="gallery">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Event <span className="text-gradient-ludo">Gallery</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl aspect-video"
              onClick={() => setLightbox(i)}
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-display font-bold text-lg">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={filtered[lightbox]?.image_url}
            alt={filtered[lightbox]?.title}
            className="max-w-full max-h-[80vh] rounded-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
