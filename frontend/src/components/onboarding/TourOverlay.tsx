import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TourOverlayProps {
  targetElement: HTMLElement | null;
  onClose?: () => void;
}

const TourOverlay = ({ targetElement, onClose }: TourOverlayProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!targetElement) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      setRect(targetElement.getBoundingClientRect());
    };

    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [targetElement]);

  if (!targetElement || !rect) return null;

  return (
    <>
      {/* Top overlay */}
      {rect.top > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-[9998]"
          style={{ height: `${rect.top}px` }}
          onClick={onClose}
        />
      )}

      {/* Bottom overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed left-0 right-0 bg-black/80 backdrop-blur-sm z-[9998]"
        style={{
          top: `${rect.bottom}px`,
          height: `${window.innerHeight - rect.bottom}px`,
        }}
        onClick={onClose}
      />

      {/* Left overlay */}
      {rect.left > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bg-black/80 backdrop-blur-sm z-[9998]"
          style={{
            top: `${rect.top}px`,
            left: 0,
            width: `${rect.left}px`,
            height: `${rect.height}px`,
          }}
          onClick={onClose}
        />
      )}

      {/* Right overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed bg-black/80 backdrop-blur-sm z-[9998]"
        style={{
          top: `${rect.top}px`,
          left: `${rect.right}px`,
          width: `${window.innerWidth - rect.right}px`,
          height: `${rect.height}px`,
        }}
        onClick={onClose}
      />

      {/* Highlight border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed border-4 border-yellow shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-[9998] pointer-events-none rounded-lg"
        style={{
          top: `${rect.top - 4}px`,
          left: `${rect.left - 4}px`,
          width: `${rect.width + 8}px`,
          height: `${rect.height + 8}px`,
        }}
      />
    </>
  );
};

export default TourOverlay;

