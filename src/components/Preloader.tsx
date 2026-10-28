"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  ready: boolean;
  onComplete: () => void;
}

export default function Preloader({ ready, onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ val: 0 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (ready) {
          gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete,
          });
        }
      },
    });

    timeline.to(progressRef.current, {
      val: ready ? 100 : 90,
      duration: ready ? 0.3 : 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(progressRef.current.val);
        setCount(v);
        if (barRef.current) {
          barRef.current.style.width = `${v}%`;
        }
      },
    });

    return () => {
      timeline.kill();
    };
  }, [ready, onComplete]);

  return (
    <div ref={containerRef} className="preloader">
      <span ref={counterRef} className="preloader-counter">
        {count}%
      </span>
      <div className="preloader-bar-track">
        <div ref={barRef} className="preloader-bar-fill" />
      </div>
    </div>
  );
}
