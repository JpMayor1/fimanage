import { overlayAnim } from "@/constants/overlay.animation.constant";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { GiWallet } from "react-icons/gi";

interface DailyLimitReachedI {
  onClose: () => void;
}

const popupAnim = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.25 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

const DailyLimitReached = ({ onClose }: DailyLimitReachedI) => {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-5"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
    >
      <motion.div
        className="relative bg-primary border border-white/10 rounded-2xl shadow-2xl py-10 px-6 w-full max-w-md flex flex-col items-center text-center"
        variants={popupAnim}
      >
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-red/20 cursor-pointer"
          onClick={onClose}
        >
          <FiX className="text-2xl text-red" />
        </button>

        <div className="flex flex-col items-center justify-center space-y-4">
          <GiWallet className="text-yellow text-6xl animate-bounce" />
          <h2 className="text-yellow text-xl font-bold">
            Tama na sa pag gastos Bossing!
          </h2>
          <p className="text-white/80 text-sm max-w-[260px]">
            Naabot o lumagpas ka na sa iyong daily limit. Medyo hinay-hinay muna
            sa gastos 😅
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-8 bg-yellow/90 hover:bg-yellow text-black font-semibold py-2 px-6 rounded-xl cursor-pointer hover:scale-105 transition-transform"
        >
          Okay, noted 😬
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DailyLimitReached;
