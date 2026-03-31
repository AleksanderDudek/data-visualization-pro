import React from "react";
import * as d3 from "d3";
import { useQuery } from "@apollo/client";
import { useD3 } from "../../hooks/useD3";
import { GET_LAUNCHES } from "../../graphql/queries";
import type { Launch } from "../../types";

interface QueryData {
  launches: Launch[];
}

export const LaunchTimeline: React.FC = () => {
  const { data, loading, error } = useQuery<QueryData>(GET_LAUNCHES, {
    variables: { upcoming: false },
  });

  const svgRef = useD3<SVGSVGElement>(
    (svg, { width, height }) => {
      if (!data?.launches.length) return;

      const launches = data.launches
        .filter((l) => !l.upcoming)
        .sort((a, b) => a.dateUnix - b.dateUnix);

      const margin = { top: 30, right: 30, bottom: 50, left: 60 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const dates = launches.map((l) => new Date(l.dateUtc));
      const x = d3
        .scaleTime()
        .domain(d3.extent(dates) as [Date, Date])
        .range([0, innerW]);

      // Group by rocket
      const rockets = Array.from(new Set(launches.map((l) => l.rocket?.name ?? "Unknown")));
      const y = d3
        .scaleBand()
        .domain(rockets)
        .range([0, innerH])
        .padding(0.3);

      const rocketColors: Record<string, string> = {};
      const colorScale = d3.scaleOrdinal(d3.schemeSet2);
      rockets.forEach((r, i) => {
        rocketColors[r] = colorScale(String(i));
      });

      // Grid
      g.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "11px");

      g.selectAll(".domain, .tick line").attr("stroke", "#2a3070");

      // Tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("opacity", 0);

      // Launch nodes
      g.selectAll(".launch-node")
        .data(launches)
        .join("circle")
        .attr("class", "launch-node")
        .attr("cx", (d) => x(new Date(d.dateUtc)))
        .attr("cy", (d) => {
          const rocketName = d.rocket?.name ?? "Unknown";
          return (y(rocketName) ?? 0) + y.bandwidth() / 2;
        })
        .attr("r", 0)
        .attr("fill", (d) => {
          if (d.success === true) return "#66bb6a";
          if (d.success === false) return "#ef5350";
          return "#9e9e9e";
        })
        .attr("fill-opacity", 0.7)
        .attr("stroke", (d) => {
          if (d.success === true) return "#66bb6a";
          if (d.success === false) return "#ef5350";
          return "#9e9e9e";
        })
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .attr("r", 7)
            .attr("fill-opacity", 1)
            .attr("stroke-width", 2);
          tooltip
            .style("opacity", 1)
            .html(
              `<div class="tooltip-title">🚀 ${d.name}</div>` +
              `<div>Flight #${d.flightNumber}</div>` +
              `<div>Date: ${new Date(d.dateUtc).toLocaleDateString()}</div>` +
              `<div>Rocket: ${d.rocket?.name ?? "Unknown"}</div>` +
              `<div>Status: <span class="tooltip-value">${
                d.success === true ? "✅ Success" : d.success === false ? "❌ Failure" : "❓ Unknown"
              }</span></div>` +
              (d.details ? `<div style="margin-top:4px;font-size:11px;opacity:0.8">${d.details.slice(0, 120)}${d.details.length > 120 ? "..." : ""}</div>` : "")
            )
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .attr("r", 4)
            .attr("fill-opacity", 0.7)
            .attr("stroke-width", 1);
          tooltip.style("opacity", 0);
        })
        .transition()
        .duration(600)
        .delay((_, i) => i * 3)
        .attr("r", 4);

      // X axis
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(8))
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "10px");

      // Legend
      const legend = svg.append("g").attr("transform", `translate(${width - 180}, 10)`);
      [
        { color: "#66bb6a", label: "Success" },
        { color: "#ef5350", label: "Failure" },
        { color: "#9e9e9e", label: "Unknown" },
      ].forEach((item, i) => {
        const lg = legend.append("g").attr("transform", `translate(0, ${i * 16})`);
        lg.append("circle").attr("r", 4).attr("cx", 4).attr("cy", 0).attr("fill", item.color);
        lg.append("text")
          .attr("x", 14)
          .attr("y", 4)
          .attr("font-size", "10px")
          .attr("fill", "#9fa8da")
          .text(item.label);
      });

      return () => {
        tooltip.remove();
      };
    },
    [data]
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Loading galactic transport logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div style={{ fontSize: 48 }}>💥</div>
        <div>{error.message}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">SpaceX Launch Timeline by Rocket</span>
      </div>
      <div className="chart-container" style={{ height: 450 }}>
        <svg ref={svgRef} />
      </div>
    </div>
  );
};
