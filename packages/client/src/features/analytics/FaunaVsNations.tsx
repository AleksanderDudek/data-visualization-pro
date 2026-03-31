import React from "react";
import * as d3 from "d3";
import { useQuery } from "@apollo/client";
import { useD3 } from "../../hooks/useD3";
import { useNumberFormatter } from "../../hooks/useNumberFormatter";
import { GET_FAUNA_VS_NATIONS } from "../../graphql/queries";
import type { FaunaVsNation } from "../../types";

interface QueryData {
  faunaVsNations: FaunaVsNation[];
}

export const FaunaVsNations: React.FC = () => {
  const { data, loading, error } = useQuery<QueryData>(GET_FAUNA_VS_NATIONS, {
    variables: { limit: 15 },
  });
  const fmt = useNumberFormatter();

  const svgRef = useD3<SVGSVGElement>(
    (svg, { width, height }) => {
      if (!data?.faunaVsNations.length) return;

      const items = data.faunaVsNations;
      const margin = { top: 30, right: 30, bottom: 60, left: 70 };
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLog()
        .domain([
          d3.min(items, (d) => d.country.population) ?? 1000,
          d3.max(items, (d) => d.country.population) ?? 1e9,
        ])
        .range([0, innerW])
        .nice();

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(items, (d) => d.pokemon.stats.total) ?? 600])
        .nice()
        .range([innerH, 0]);

      const r = d3
        .scaleLinear()
        .domain([
          d3.min(items, (d) => d.powerRatio) ?? 0,
          d3.max(items, (d) => d.powerRatio) ?? 100,
        ])
        .range([10, 35]);

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
      g.selectAll(".matchup")
        .data(items)
        .join("circle")
        .attr("class", "matchup")
        .attr("cx", (d) => x(d.country.population))
        .attr("cy", (d) => y(d.pokemon.stats.total))
        .attr("r", 0)
        .attr("fill", "#ec407a")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#ec407a")
        .attr("stroke-width", 1.5)
        .attr("cursor", "pointer")
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget)
            .attr("fill-opacity", 0.8)
            .attr("stroke-width", 3);
          tooltip
            .style("opacity", 1)
            .html(
              `<div class="tooltip-title">${d.pokemon.name.toUpperCase()} vs ${d.country.flagEmoji} ${d.country.name}</div>` +
              `<div>Power Ratio: <span class="tooltip-value">${d.powerRatio}</span></div>` +
              `<div>Pokemon Stats: ${d.pokemon.stats.total}</div>` +
              `<div>Country Pop: ${fmt(d.country.population)}</div>` +
              `<div style="margin-top:6px;font-style:italic;font-size:11px;opacity:0.8">"${d.absurdFact}"</div>`
            )
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .attr("fill-opacity", 0.5)
            .attr("stroke-width", 1.5);
          tooltip.style("opacity", 0);
        })
        .transition()
        .duration(800)
        .delay((_, i) => i * 80)
        .attr("r", (d) => r(d.powerRatio));

      // Labels
      g.selectAll(".matchup-label")
        .data(items)
        .join("text")
        .attr("class", "matchup-label")
        .attr("x", (d) => x(d.country.population))
        .attr("y", (d) => y(d.pokemon.stats.total))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "9px")
        .attr("fill", "#fff")
        .attr("pointer-events", "none")
        .attr("opacity", 0)
        .text((d) => `${d.country.flagEmoji}`)
        .transition()
        .duration(600)
        .delay((_, i) => i * 80 + 400)
        .attr("opacity", 1);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(
          d3.axisBottom(x).tickFormat((d) => fmt(d as number))
        )
        .selectAll("text")
        .attr("fill", "#9fa8da")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-30)")
        .attr("text-anchor", "end");

      g.append("g")
        .call(d3.axisLeft(y))
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
        .text("Country Population (log) →");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "#5c6bc0")
        .text("Pokemon Total Stats →");

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
        <div className="loading-text">Cross-referencing fauna with national databases...</div>
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
    <>
      <div className="fun-fact">
        <span className="fact-icon">⚔️</span>
        <span>
          This scientific chart answers the question nobody asked: "How do Pokemon power levels compare to country populations?" 
          Bubble size = Power Ratio (stats / log₁₀(population)). Hover for absurd but technically accurate facts.
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            The Ultimate Showdown: Pokemon Stats vs Country Population
          </span>
        </div>
        <div className="chart-container" style={{ height: 500 }}>
          <svg ref={svgRef} />
        </div>
      </div>

      {data && (
        <div style={{ marginTop: 20 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Matchup Details</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 12, marginTop: 8 }}>
              {data.faunaVsNations.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px 16px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {item.pokemon.spriteUrl && (
                    <img
                      src={item.pokemon.spriteUrl}
                      alt={item.pokemon.name}
                      style={{ width: 48, height: 48, imageRendering: "pixelated" }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, textTransform: "capitalize" }}>
                      {item.pokemon.name} VS {item.country.flagEmoji} {item.country.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", marginTop: 4 }}>
                      "{item.absurdFact}"
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-pink)" }}>
                      {item.powerRatio}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)" }}>
                      POWER RATIO
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
