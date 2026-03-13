import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import gallery1 from "@/assets/gallery/gallery-1.jpeg";
import gallery2 from "@/assets/gallery/gallery-2.jpeg";
import gallery3 from "@/assets/gallery/gallery-3.jpeg";
import gallery4 from "@/assets/gallery/gallery-4.jpeg";
import gallery5 from "@/assets/gallery/gallery-5.jpeg";
import gallery6 from "@/assets/gallery/gallery-6.jpeg";
import gallery7 from "@/assets/gallery/gallery-7.jpeg";
import gallery8 from "@/assets/gallery/gallery-8.jpeg";
import gallery9 from "@/assets/gallery/gallery-9.jpeg";
import gallery10 from "@/assets/gallery/gallery-10.jpeg";
import gallery11 from "@/assets/gallery/gallery-11.jpeg";
import gallery12 from "@/assets/gallery/gallery-12.jpeg";
import gallery13 from "@/assets/gallery/gallery-13.jpeg";
import gallery14 from "@/assets/gallery/gallery-14.jpeg";
import gallery15 from "@/assets/gallery/gallery-15.jpeg";
import gallery16 from "@/assets/gallery/gallery-16.jpeg";
import gallery17 from "@/assets/gallery/gallery-17.jpeg";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const fallbackItems: GalleryItem[] = [
  { id: "1", image_url: gallery1, category: "Family Events", title: "Indoor Ludo Setup" },
  { id: "2", image_url: gallery2, category: "Family Events", title: "Outdoor Ludo Fun" },
  { id: "3", image_url: gallery3, category: "Family Events", title: "Street Ludo Game" },
  { id: "4", image_url: gallery4, category: "Family Events", title: "Night Ludo Party" },
  { id: "5", image_url: gallery5, category: "Family Events", title: "Goti Pe Goti Moment" },
  { id: "6", image_url: gallery6, category: "Deliveries", title: "Happy Customer Delivery" },
  { id: "7", image_url: gallery7, category: "Deliveries", title: "Customer Shoutout" },
  { id: "8", image_url: gallery8, category: "Deliveries", title: "Ludo Vibes Parcel" },
  { id: "9", image_url: gallery9, category: "Family Events", title: "Snakes & Ladders Fun" },
  { id: "10", image_url: gallery10, category: "Deliveries", title: "Customer Love" },
  { id: "11", image_url: gallery11, category: "Family Events", title: "Ludo Board Design" },
  { id: "12", image_url: gallery12, category: "Family Events", title: "School Ludo Event" },
  { id: "13", image_url: gallery13, category: "Family Events", title: "Snakes & Ladders Board" },
  { id: "14", image_url: gallery14, category: "Family Events", title: "Indoor Game Setup" },
  { id: "15", image_url: gallery15, category: "Family Events", title: "Friends Playing Together" },
  { id: "16", image_url: gallery16, category: "Family Events", title: "Dice Throw Action" },
  { id: "17", image_url: gallery17, category: "Family Events", title: "Night Game Party" },
];

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
