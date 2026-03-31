import React from "react";
import * as d3 from "d3";
import { useD3 } from "../../hooks/useD3";
import type { RegionStats } from "../../types";

interface Props {
  data: RegionStats[];
}

const COLORS = ["#42a5f5", "#ab47bc", "#66bb6a", "#ffa726", "#ef5350", "#26c6da", "#ec407a"];

export const RegionChart: React.FC<Props> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.totalPopulation - a.totalPopulation);

  const svgRef = useD3<SVGSVGElement>(
    (svg, { width, height }) => {
      const margin = { top: 20, right: 20, bottom: 60, left: 80 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .domain(sortedData.map((d) => d.region))
        .range([0, innerW])
        .padding(0.3);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(sortedData, (d) => d.totalPopulation) ?? 0])
        .nice()
        .range([innerH, 0]);

      // Grid lines
      g.append("g")
        .attr("class", "grid")
        .call(
          d3.axisLeft(y)
            .tickSize(-innerW)
            .tickFormat(() => "")
        )
        .selectAll("line")
        .attr("stroke", "#2a3070")
        .attr("stroke-opacity", 0.5);

      g.selectAll(".grid .domain").remove();

      // Bars with animation
      g.selectAll(".bar")
        .data(sortedData)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.region) ?? 0)
        .attr("width", x.bandwidth())
        .attr("y", innerH)
        .attr("height", 0)
        .attr("fill", (_, i) => COLORS[i % COLORS.length])
        .attr("rx", 4)
        .attr("ry", 4)
        .transition()
        .duration(800)
        .delay((_, i) => i * 100)
        .attr("y", (d) => y(d.totalPopulation))
        .attr("height", (d) => innerH - y(d.totalPopulation));

      // X axis
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "11px")
        .attr("transform", "rotate(-25)")
        .attr("text-anchor", "end");

      g.selectAll(".domain").attr("stroke", "#2a3070");
      g.selectAll(".tick line").attr("stroke", "#2a3070");

      // Y axis
      g.append("g")
        .call(
          d3.axisLeft(y).tickFormat((d) => {
            const n = d as number;
            if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
            if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
            return `${n}`;
          })
        )
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "11px");

      // Country count labels
      g.selectAll(".count-label")
        .data(sortedData)
        .join("text")
        .attr("class", "count-label")
        .attr("x", (d) => (x(d.region) ?? 0) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.totalPopulation) - 8)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#9fa8da")
        .attr("opacity", 0)
        .text((d) => `${d.countryCount} countries`)
        .transition()
        .duration(800)
        .delay((_, i) => i * 100 + 400)
        .attr("opacity", 1);
    },
    [sortedData]
  );

  return <svg ref={svgRef} />;
};
