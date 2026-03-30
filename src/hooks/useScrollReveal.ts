"use client";

import { useEffect, useRef, useCallback } from "react";

export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function useScrollRevealAll(
  selector = ".reveal",
  threshold = 0.1
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedRef = useRef<Set<Element>>(new Set());

  const observeElements = useCallback(() => {
    if (!observerRef.current) return;
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (!observedRef.current.has(el) && !el.classList.contains("revealed")) {
        observedRef.current.add(el);
        observerRef.current!.observe(el);
      }
    });
  }, [selector]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay || "0";
            setTimeout(() => {
              el.classList.add("revealed");
            }, parseInt(delay));
            observerRef.current?.unobserve(el);
            observedRef.current.delete(el);
          }
        });
      },
      { threshold }
    );

    observeElements();

    const mutation = new MutationObserver(() => {
      observeElements();
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
      mutation.disconnect();
      observedRef.current.clear();
    };
  }, [selector, threshold, observeElements]);
}
