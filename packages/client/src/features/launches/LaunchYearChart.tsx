import React from "react";
import * as d3 from "d3";
import { useD3 } from "../../hooks/useD3";
import type { YearCount } from "../../types";

interface Props {
  data: YearCount[];
}

export const LaunchYearChart: React.FC<Props> = ({ data }) => {
  const svgRef = useD3<SVGSVGElement>(
    (svg, { width, height }) => {
      const margin = { top: 20, right: 20, bottom: 40, left: 50 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.year) as [number, number])
        .range([0, innerW]);

      const maxCount = d3.max(data, (d) => d.count) ?? 0;
      const y = d3
        .scaleLinear()
        .domain([0, maxCount])
        .nice()
        .range([innerH, 0]);

      // Grid
      g.append("g")
        .call(d3.axisLeft(y).tickSize(-innerW).tickFormat(() => ""))
        .selectAll("line")
        .attr("stroke", "#2a3070")
        .attr("stroke-opacity", 0.5);
      g.selectAll(".domain").remove();

      // Stacked area: successes + failures
      const areaSuccess = d3
        .area<YearCount>()
        .x((d) => x(d.year))
        .y0(innerH)
        .y1((d) => y(d.successes))
        .curve(d3.curveMonotoneX);

      const areaFailure = d3
        .area<YearCount>()
        .x((d) => x(d.year))
        .y0((d) => y(d.successes))
        .y1((d) => y(d.successes + d.failures))
        .curve(d3.curveMonotoneX);

      g.append("path").datum(data).attr("fill", "#66bb6a").attr("fill-opacity", 0.3).attr("d", areaSuccess);
      g.append("path").datum(data).attr("fill", "#ef5350").attr("fill-opacity", 0.3).attr("d", areaFailure);

      // Success line with draw animation
      const lineSuccess = d3
        .line<YearCount>()
        .x((d) => x(d.year))
        .y((d) => y(d.successes))
        .curve(d3.curveMonotoneX);

      const successPath = g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#66bb6a")
        .attr("stroke-width", 2.5)
        .attr("d", lineSuccess);

      const totalLength = (successPath.node() as SVGPathElement)?.getTotalLength() ?? 0;
      successPath
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Total count line (dashed)
      const lineTotal = d3
        .line<YearCount>()
        .x((d) => x(d.year))
        .y((d) => y(d.count))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#42a5f5")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6 3")
        .attr("d", lineTotal);

      // Dots
      g.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.count))
        .attr("r", 0)
        .attr("fill", "#42a5f5")
        .transition()
        .duration(600)
        .delay((_, i) => i * 50)
        .attr("r", 3);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickFormat((d) => String(d)))
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "11px");

      g.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "11px");

      // Legend
      const legend = svg.append("g").attr("transform", `translate(${margin.left + 10}, 10)`);
      [
        { color: "#42a5f5", label: "Total", dash: true },
        { color: "#66bb6a", label: "Successes", dash: false },
        { color: "#ef5350", label: "Failures", dash: false },
      ].forEach((item, i) => {
        const lg = legend.append("g").attr("transform", `translate(${i * 100}, 0)`);
        lg.append("line")
          .attr("x1", 0).attr("x2", 16).attr("y1", 5).attr("y2", 5)
          .attr("stroke", item.color).attr("stroke-width", 2)
          .attr("stroke-dasharray", item.dash ? "4 2" : "none");
        lg.append("text")
          .attr("x", 20).attr("y", 9).attr("font-size", "10px")
          .attr("fill", "#9fa8da").text(item.label);
      });
    },
    [data]
  );

  return <svg ref={svgRef} />;
};
