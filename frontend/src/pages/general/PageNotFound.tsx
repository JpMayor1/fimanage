import { motion } from "framer-motion";
import { FaRegSadTear } from "react-icons/fa";
import { RxHome } from "react-icons/rx";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[100dvh] bg-primary flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Floating yellow glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-yellow/10 blur-3xl rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sad Icon */}
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="text-yellow text-6xl mb-4"
      >
        <FaRegSadTear className="animate-pulse" />
      </motion.div>

      {/* 404 Text */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-7xl md:text-9xl font-extrabold text-yellow"
      >
        404
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-white/80 text-lg md:text-2xl mt-3 text-center"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      {/* Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 z-10"
      >
        <Link
          to="/"
          className="flex items-center gap-2 bg-yellow hover:bg-yellow/90 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-300"
        >
          <RxHome className="text-xl" />
          Go Back Home
        </Link>
      </motion.div>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-8">
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

export default PageNotFound;
