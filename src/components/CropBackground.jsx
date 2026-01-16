import { useMemo } from "react";

/**
 * CropBackground
 * - Animated crop icons floating (premium look)
 * - Soft gradient overlay
 * - Reusable background component
 */
export default function CropBackground() {
  const items = useMemo(() => {
    const icons = ["🌾", "🍅", "🥔", "🧅", "🌶️", "🥬", "🥕", "🍌", "🥥"];
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 18 + Math.random() * 26,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-lime-50" />

      {/* Floating crop icons */}
      {items.map((it) => (
        <div
          key={it.id}
          className="absolute select-none"
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            fontSize: `${it.size}px`,
            opacity: it.opacity,
            animation: `floatY ${it.duration}s ease-in-out ${it.delay}s infinite alternate`,
            filter: "blur(0.1px)",
          }}
        >
          {it.icon}
        </div>
      ))}

      {/* Extra premium glow blobs */}
      <div className="absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-lime-200/40 blur-3xl" />

      {/* Keyframes */}
      <style>
        {`
          @keyframes floatY {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-28px) rotate(8deg); }
          }
        `}
      </style>
    </div>
  );
}
