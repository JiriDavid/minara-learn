"use client";
import { motion } from "framer-motion";

const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Deep navy radial base */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#001f3f_0%,#001a33_50%,#000814_100%)]" />

    {/* Gentle linear shading overlay for contrast */}
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#001f3f,#00152b,#000814)] opacity-30 mix-blend-overlay" />

    {/* Animated subtle navy blobs */}
    <motion.div
      className="absolute top-[-10%] left-[25%] w-[280px] h-[280px] bg-[#003366]/20 rounded-full blur-3xl"
      animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[-10%] right-[15%] w-[220px] h-[220px] bg-[#002244]/20 rounded-full blur-2xl"
      animate={{ x: [0, -35, 0], y: [0, -25, 0] }}
      transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/4 left-1/3 w-[160px] h-[160px] bg-[#001933]/15 rounded-full blur-2xl"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Subtle grid for modern touch */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    />

    {/* Optional noise for light texture */}
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />

    {/* Subtle spotlight effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%)]" />
  </div>
);

export default GradientBackground;
