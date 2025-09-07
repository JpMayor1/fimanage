import { motion } from "framer-motion";
import React from "react";
import { CiBank } from "react-icons/ci";
import { FaPiggyBank, FaWallet } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

const AnimatedBackground: React.FC = () => {
  const floatingElements = [
    { icon: FaPiggyBank, x: "10%", y: "20%", delay: 0, duration: 6 },
    { icon: FaArrowTrendUp, x: "85%", y: "15%", delay: 1, duration: 8 },
    { icon: CiBank, x: "20%", y: "70%", delay: 2, duration: 7 },
    { icon: FaWallet, x: "80%", y: "65%", delay: 3, duration: 9 },
    { icon: FaArrowTrendUp, x: "15%", y: "45%", delay: 4, duration: 6 },
    { icon: FaPiggyBank, x: "90%", y: "40%", delay: 5, duration: 8 },
  ];

  const gridLines = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background (black → dark gold glow) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-black to-primary" />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        {gridLines.map((line) => (
          <motion.div
            key={`h-${line}`}
            className="absolute h-px bg-yellow w-full"
            style={{ top: `${line * 5}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: line * 0.1,
            }}
          />
        ))}
        {gridLines.map((line) => (
          <motion.div
            key={`v-${line}`}
            className="absolute w-px bg-yellow h-full"
            style={{ left: `${line * 5}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: line * 0.1 + 2,
            }}
          />
        ))}
      </div>

      {/* Floating Financial Icons */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.icon;
        return (
          <motion.div
            key={index}
            className="absolute text-yellow/20"
            style={{
              left: element.x,
              top: element.y,
            }}
            initial={{ y: 0, rotate: 0, scale: 0 }}
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          >
            <IconComponent className="text-4xl md:text-6xl" />
          </motion.div>
        );
      })}

      {/* Subtle Gold Glow Blocks */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-20 h-20 bg-yellow/10 rounded-lg"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-16 h-16 bg-yellow/10 rounded-full"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles (Gold Dots) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-50, 50, -50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
