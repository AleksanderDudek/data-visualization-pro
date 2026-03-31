import { useRef, useEffect } from "react";
import * as d3 from "d3";

/**
 * Hook for managing a D3 visualization inside a React component.
 * Handles SVG creation, responsive resizing, and cleanup.
 */
export function useD3<T extends SVGSVGElement>(
  renderFn: (
    svg: d3.Selection<T, unknown, null, undefined>,
    dimensions: { width: number; height: number }
  ) => void,
  deps: React.DependencyList
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const container = node.parentElement;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const svg = d3.select(node);
    svg.attr("width", width).attr("height", height);

    // Clear previous render
    svg.selectAll("*").remove();

    renderFn(svg as d3.Selection<T, unknown, null, undefined>, { width, height });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
