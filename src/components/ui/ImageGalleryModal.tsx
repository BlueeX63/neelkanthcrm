import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryModalProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageGalleryModal({ images, initialIndex = 0, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  const next = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50"
        >
          <X className="w-8 h-8" />
        </button>

        {images.length > 1 && (
          <>
            <button 
              onClick={prev} 
              className="absolute left-6 text-white/50 hover:text-white hover:scale-110 transition-all z-50 p-2"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button 
              onClick={next} 
              className="absolute right-6 text-white/50 hover:text-white hover:scale-110 transition-all z-50 p-2"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          </>
        )}

        <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex flex-col items-center justify-center p-8">
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={images[currentIndex]} 
            alt={`Gallery Image ${currentIndex + 1}`} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
          />
          
          {images.length > 1 && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
              {images.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all rounded-full ${
                    i === currentIndex 
                      ? "w-3 h-3 bg-white scale-110" 
                      : "w-2 h-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
