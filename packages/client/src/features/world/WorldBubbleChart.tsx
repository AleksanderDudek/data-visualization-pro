import React from "react";
import * as d3 from "d3";
import { useQuery } from "@apollo/client";
import { useD3 } from "../../hooks/useD3";
import { useNumberFormatter } from "../../hooks/useNumberFormatter";
import { GET_COUNTRIES } from "../../graphql/queries";
import { useAppSelector } from "../../store";
import type { Country } from "../../types";

interface QueryData {
  countries: Country[];
}

export const WorldBubbleChart: React.FC = () => {
  const regionFilter = useAppSelector((s) => s.filters.regionFilter);
  const { data, loading, error } = useQuery<QueryData>(GET_COUNTRIES, {
    variables: { region: regionFilter, limit: 100 },
  });
  const fmt = useNumberFormatter();

  const svgRef = useD3<SVGSVGElement>(
    (svg, { width, height }) => {
      if (!data?.countries.length) return;

      const countries = data.countries.filter((c) => c.population > 0);
      const margin = { top: 30, right: 30, bottom: 50, left: 70 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const regionColors: Record<string, string> = {
        Africa: "#ffa726",
        Americas: "#42a5f5",
        Asia: "#ef5350",
        Europe: "#66bb6a",
        Oceania: "#ab47bc",
        Antarctic: "#26c6da",
      };

      const x = d3
        .scaleLog()
        .domain([
          d3.min(countries, (d) => d.area ?? 1) ?? 1,
          d3.max(countries, (d) => d.area ?? 1) ?? 1,
        ])
        .range([0, innerW])
        .nice();

      const y = d3
        .scaleLog()
        .domain([
          d3.min(countries, (d) => d.population) ?? 1,
          d3.max(countries, (d) => d.population) ?? 1,
        ])
        .range([innerH, 0])
        .nice();

      const r = d3
        .scaleSqrt()
        .domain([0, d3.max(countries, (d) => d.population) ?? 1])
        .range([3, 40]);

      // Grid
      g.append("g")
        .call(d3.axisLeft(y).tickSize(-innerW).tickFormat(() => ""))
        .selectAll("line")
        .attr("stroke", "#2a3070")
        .attr("stroke-opacity", 0.3);
      g.selectAll(".domain").remove();

      // Tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("opacity", 0);

      // Bubbles
      g.selectAll(".bubble")
        .data(countries)
        .join("circle")
        .attr("class", "bubble")
        .attr("cx", (d) => x(d.area ?? 1))
        .attr("cy", (d) => y(d.population))
        .attr("r", 0)
        .attr("fill", (d) => regionColors[d.region] ?? "#666")
        .attr("fill-opacity", 0.6)
        .attr("stroke", (d) => regionColors[d.region] ?? "#666")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .attr("fill-opacity", 0.9)
            .attr("stroke-width", 2);
          tooltip
            .style("opacity", 1)
            .html(
              `<div class="tooltip-title">${d.flagEmoji} ${d.name}</div>` +
              `<div>Population: <span class="tooltip-value">${fmt(d.population)}</span></div>` +
              `<div>Area: <span class="tooltip-value">${fmt(d.area ?? 0)} km²</span></div>` +
              `<div>Region: ${d.region}</div>` +
              (d.capital ? `<div>Capital: ${d.capital}</div>` : "")
            )
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .attr("fill-opacity", 0.6)
            .attr("stroke-width", 1);
          tooltip.style("opacity", 0);
        })
        .transition()
        .duration(800)
        .delay((_, i) => i * 5)
        .attr("r", (d) => r(d.population));

      // Country labels for large countries
      const bigCountries = countries
        .filter((c) => c.population > 50_000_000)
        .sort((a, b) => b.population - a.population)
        .slice(0, 15);

      g.selectAll(".label")
        .data(bigCountries)
        .join("text")
        .attr("class", "label")
        .attr("x", (d) => x(d.area ?? 1))
        .attr("y", (d) => y(d.population) - r(d.population) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("fill", "#9fa8da")
        .attr("opacity", 0)
        .text((d) => d.code)
        .transition()
        .duration(600)
        .delay(1000)
        .attr("opacity", 1);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(
          d3.axisBottom(x).tickFormat((d) => {
            const n = d as number;
            if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
            if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
            return `${n}`;
          })
        )
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "10px");

      g.append("g")
        .call(
          d3.axisLeft(y).tickFormat((d) => {
            const n = d as number;
            if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
            if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
            if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
            return `${n}`;
          })
        )
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "10px");

      // Axis labels
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#5c6bc0")
        .text("Area (km²) →");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#5c6bc0")
        .text("Population →");

      // Legend
      const legend = svg.append("g").attr("transform", `translate(${width - 140}, 30)`);
      const regions = Object.entries(regionColors);
      regions.forEach(([region, color], i) => {
        const lg = legend.append("g").attr("transform", `translate(0, ${i * 18})`);
        lg.append("circle").attr("r", 5).attr("cx", 5).attr("cy", 0).attr("fill", color);
        lg.append("text")
          .attr("x", 16)
          .attr("y", 4)
          .attr("font-size", "10px")
          .attr("fill", "#9fa8da")
          .text(region);
      });

      // Cleanup tooltip on unmount
      return () => {
        tooltip.remove();
      };
    },
    [data, regionFilter]
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Scanning planetary databases...</div>
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
        <span className="card-title">
          Population vs Area — Bubble Chart (log scale)
        </span>
      </div>
      <div className="chart-container" style={{ height: 500 }}>
        <svg ref={svgRef} />
      </div>
    </div>
  );
};
