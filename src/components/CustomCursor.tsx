"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCursorStore } from "@/lib/cursor-store";
import { isTouchDevice } from "@/lib/utils";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { state, label } = useCursorStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isTouchDevice()) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveX = gsap.quickTo(cursor, "x", {
      duration: 0.18,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(cursor, "y", {
      duration: 0.18,
      ease: "power3.out",
    });
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      moveX(event.clientX);
      moveY(event.clientY);
      gsap.set(cursor, { autoAlpha: 1 });
    };

    // Track hover states for interactive elements
    const handlePointerOver = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const closest = target.closest(
        "a, button, [data-cursor='link']"
      );
      const projectCard = target.closest("[data-cursor='project']");
      const textArea = target.closest("[data-cursor='text']");

      if (projectCard) {
        useCursorStore.getState().setState("project", "View");
      } else if (textArea) {
        useCursorStore.getState().setState("text", "Read");
      } else if (closest) {
        useCursorStore.getState().setState("link");
      }
    };

    const handlePointerOut = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const related = (e as PointerEvent).relatedTarget;
      const relatedElement = related instanceof Node ? related : null;
      const interactive = target.closest(
        "a, button, [data-cursor='link'], [data-cursor='project'], [data-cursor='text']"
      );

      if (interactive && (!relatedElement || !interactive.contains(relatedElement))) {
        useCursorStore.getState().reset();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      gsap.killTweensOf(cursor);
    };
  }, [isClient]);

  if (!isClient || isTouchDevice()) return null;

  const stateClass =
    state === "link"
      ? "link-hover"
      : state === "project"
        ? "project-hover"
        : state === "text"
          ? "text-hover"
          : "";

  return (
    <div ref={cursorRef} className={`custom-cursor ${stateClass}`} aria-hidden="true">
      {label && <span className="custom-cursor-label">{label}</span>}
    </div>
  );
}
