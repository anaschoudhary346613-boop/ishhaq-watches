"use client";

import { useEffect } from "react";

/**
 * Reusable hook to enable scroll animations using the 'reveal' class.
 * All elements with the 'reveal' class will fade in and slide up when scrolled into view.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
