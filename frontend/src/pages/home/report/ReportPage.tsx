import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import { motion } from "framer-motion";
import { FaHourglassHalf } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const ReportPage = () => {
  const { setOpen } = useSideBar();

  return (
    <motion.div
      key="coming-soon-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className="relative w-full h-full flex flex-col justify-center items-center bg-primary overflow-hidden px-2 md:px-4"
    >
      {/* Sidebar Menu Icon */}
      <RxHamburgerMenu
        className="md:hidden text-white text-2xl absolute top-3.5 left-3 z-10 cursor-pointer"
        onClick={() => setOpen(true)}
      />

      {/* Floating Background Glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-yellow/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hourglass Icon Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex items-center justify-center mb-4 text-yellow"
      >
        <FaHourglassHalf className="text-6xl animate-pulse" />
      </motion.div>

      {/* Coming Soon Text */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-white text-4xl md:text-5xl font-bold text-center tracking-wide"
      >
        Coming Soon
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-white/70 mt-3 text-center text-sm md:text-base max-w-md"
      >
        We’re currently working hard to bring you insightful reports and
        analytics. Stay tuned for updates!
      </motion.p>

      {/* Bouncing Dots Animation */}
      <div className="flex mt-6 gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-yellow"
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ReportPage;
