import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  { id: 1, src: "/videos/fun-1.mp4", title: "Life-Size Ludo Fun" },
  { id: 2, src: "/videos/fun-2.mp4", title: "Giant Dice Action" },
  { id: 3, src: "/videos/fun-3.mp4", title: "Family Game Time" },
  { id: 4, src: "/videos/fun-4.mp4", title: "Party Vibes" },
  { id: 5, src: "/videos/fun-5.mp4", title: "Epic Moments" },
  { id: 6, src: "/videos/fun-6.mp4", title: "Kids Having Fun" },
  { id: 7, src: "/videos/fun-7.mp4", title: "Outdoor Gaming" },
  { id: 8, src: "/videos/fun-8.mp4", title: "Team Challenge" },
  { id: 9, src: "/videos/fun-9.mp4", title: "Game Night Highlights" },
];

const FunZone = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 px-4 bg-secondary/30 border-y border-border/60" id="fun-zone">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="section-eyebrow mb-5">Video</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Fun <span className="text-gradient-ludo">Zone</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Watch the excitement unfold — real moments from our life-size game events!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[9/16] bg-foreground/5 border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              onClick={() => setActiveVideo(i)}
            >
              <video
                src={video.src}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
              />
              <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-primary-foreground ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/60 to-transparent">
                <span className="font-display font-bold text-white text-sm">{video.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen video lightbox */}
      {activeVideo !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors z-10"
            onClick={() => setActiveVideo(null)}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          {activeVideo > 0 && (
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setActiveVideo(activeVideo - 1); }}
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
          )}
          {activeVideo < videos.length - 1 && (
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setActiveVideo(activeVideo + 1); }}
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          )}
          <motion.video
            key={activeVideo}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={videos[activeVideo].src}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-[90vh] rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default FunZone;
