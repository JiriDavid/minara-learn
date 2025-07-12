"use client";
import { motion } from "framer-motion";

const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Vibrant radial background blend with purple added */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4b0082_0%,#5f0f40_40%,#0077b6_80%,#00b4d8_100%)]" />

    {/* Linear overlay with more contrast */}
    <div className="absolute inset-0 bg-[linear-gradient(115deg,#a4508b,#5f0f40,#0077b6,#00b4d8)] opacity-20 mix-blend-overlay" />

    {/* Dynamic animated gradients for depth */}
    <motion.div
      className="absolute top-[-10%] left-[30%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-3xl"
      animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[-10%] right-[20%] w-[250px] h-[250px] bg-blue-400/20 rounded-full blur-2xl"
      animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
      transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/3 left-1/3 w-[200px] h-[200px] bg-pink-400/20 rounded-full blur-2xl"
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Grid overlay for modern structure */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    />

    {/* Optional noise for light texture */}
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />

    {/* Gentle radial glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.07),transparent_60%)]" />
  </div>
);

export default GradientBackground;
