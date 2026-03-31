import { useState, useEffect } from "react";

/**
 * Observes a container element and returns its current pixel dimensions.
 * Re-fires on every resize via ResizeObserver.
 */
export function useContainerDimensions(ref: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return dimensions;
}
