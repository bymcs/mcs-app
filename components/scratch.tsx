"use client";

import React, { useEffect } from "react";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import toast from "react-hot-toast";

const ScratchToRevealDemo = () => {
  const handleComplete = () => {
    toast.success("You won $100!");
  };

  useEffect(() => {
    // Mobil scroll'u engelle
    const container = document.getElementById('scratch-container');
    
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    if (container) {
      container.addEventListener('touchmove', preventDefault, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchmove', preventDefault);
      }
    };
  }, []);

  return (
    <div 
      id="scratch-container"
      className="relative touch-none select-none overflow-hidden max-w-[300px] mx-auto"
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <ScratchToReveal
        width={280}
        height={280}
        minScratchPercentage={70}
        className="flex items-center justify-center overflow-hidden rounded-2xl border-4 border-gray-300 bg-gray-400 bg-[url('/scratch-texture.png')] touch-none"
        onComplete={handleComplete}
        gradientColors={["#A0A0A0", "#C0C0C0", "#E0E0E0"]}
      >
        <div className="flex flex-col items-center justify-center h-full w-full bg-green-500 rounded-2xl">
          <p className="text-6xl select-none">💵</p>
          <p className="mt-2 text-2xl font-bold text-white select-none">You Win $100!</p>
        </div>
      </ScratchToReveal>
      <div className="mt-2 text-center text-sm text-gray-500">
        Kazımak için ekranı kaydırın
      </div>
    </div>
  );
};

export { ScratchToRevealDemo };
