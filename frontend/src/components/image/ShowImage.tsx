import { imgAnim } from "@/constants/image.animation.constant";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import BlurImage from "../custom/BlurImage";

interface ShowImageI {
  image: string;
  onClose: () => void;
}

const ShowImage = ({ image, onClose }: ShowImageI) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <motion.div
      key="img-modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black/90 p-10 overflow-hidden z-30"
    >
      <button
        className="absolute top-5 right-5 cursor-pointer"
        onClick={onClose}
        tabIndex={0}
        aria-label="Close image"
      >
        <IoClose className="text-red text-3xl" />
      </button>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={imgAnim}
        className="flex items-center justify-center h-full"
      >
        <BlurImage
          src={image}
          alt={image}
          className="h-full md:h-150 w-auto rounded-full border-2 border-primary object-cover bg-white shadow-sm"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default ShowImage;
