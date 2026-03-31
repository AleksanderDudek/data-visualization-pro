import React, { useMemo } from "react";
import * as d3 from "d3";
import { useQuery } from "@apollo/client";
import { useD3 } from "../../hooks/useD3";
import { GET_POKEMON } from "../../graphql/queries";
import type { Pokemon } from "../../types";

interface QueryData {
  pokemon: Pokemon[];
}

const STAT_COLORS: Record<string, string> = {
  hp: "#ef5350",
  attack: "#ffa726",
  defense: "#42a5f5",
  specialAttack: "#ab47bc",
  specialDefense: "#66bb6a",
  speed: "#26c6da",
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  specialAttack: "SPA",
  specialDefense: "SPD",
  speed: "SPE",
};

export const PokemonRadar: React.FC<{ pokemon: Pokemon; size: number }> = ({
  pokemon,
  size,
}) => {
  const svgRef = useD3<SVGSVGElement>(
    (svg, { width, height }) => {
      const center = { x: width / 2, y: height / 2 };
      const radius = Math.min(width, height) / 2 - 30;

      const stats = [
        { key: "hp", value: pokemon.stats.hp },
        { key: "attack", value: pokemon.stats.attack },
        { key: "defense", value: pokemon.stats.defense },
        { key: "specialAttack", value: pokemon.stats.specialAttack },
        { key: "specialDefense", value: pokemon.stats.specialDefense },
        { key: "speed", value: pokemon.stats.speed },
      ];

      const angleSlice = (Math.PI * 2) / stats.length;
      const maxStat = 255; // Max base stat in Pokemon

      const g = svg.append("g").attr("transform", `translate(${center.x},${center.y})`);

      // Background rings
      const levels = 5;
      for (let i = 1; i <= levels; i++) {
        const r = (radius / levels) * i;
        g.append("circle")
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", "#2a3070")
          .attr("stroke-opacity", 0.5);
      }

      // Axis lines and labels
      stats.forEach((stat, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x2 = Math.cos(angle) * radius;
        const y2 = Math.sin(angle) * radius;

        g.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", "#2a3070")
          .attr("stroke-opacity", 0.5);

        const labelDist = radius + 18;
        g.append("text")
          .attr("x", Math.cos(angle) * labelDist)
          .attr("y", Math.sin(angle) * labelDist)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-size", "9px")
          .attr("fill", STAT_COLORS[stat.key])
          .attr("font-weight", "600")
          .text(STAT_LABELS[stat.key]);
      });

      // Data polygon
      const radarLine = d3
        .lineRadial<{ key: string; value: number }>()
        .angle((_, i) => angleSlice * i)
        .radius((d) => (d.value / maxStat) * radius)
        .curve(d3.curveLinearClosed);

      // Animated fill
      g.append("path")
        .datum(stats)
        .attr("d", radarLine(stats.map((s) => ({ ...s, value: 0 }))))
        .attr("fill", "#42a5f5")
        .attr("fill-opacity", 0.15)
        .attr("stroke", "#42a5f5")
        .attr("stroke-width", 2)
        .transition()
        .duration(800)
        .attr("d", radarLine);

      // Data dots
      stats.forEach((stat, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r2 = (stat.value / maxStat) * radius;

        g.append("circle")
          .attr("cx", Math.cos(angle) * r2)
          .attr("cy", Math.sin(angle) * r2)
          .attr("r", 0)
          .attr("fill", STAT_COLORS[stat.key])
          .transition()
          .duration(600)
          .delay(200 + i * 60)
          .attr("r", 4);
      });
    },
    [pokemon]
  );

  return (
    <div style={{ width: size, height: size }}>
      <svg ref={svgRef} />
    </div>
  );
};

export const FaunaRegistry: React.FC = () => {
  const { data, loading, error } = useQuery<QueryData>(GET_POKEMON, {
    variables: { limit: 24, offset: 0 },
  });

  const sortedPokemon = useMemo(() => {
    if (!data?.pokemon) return [];
    return [...data.pokemon].sort((a, b) => b.stats.total - a.stats.total);
  }, [data]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Cataloging known fauna species...</div>
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
        <span className="fact-icon">🔬</span>
        <span>
          These specimens were discovered across multiple galactic sectors. Their
          combat stats have been normalized to the Universal Power Index (UPI).
        </span>
      </div>

      <div className="fauna-grid">
        {sortedPokemon.map((p) => (
          <div key={p.id} className="fauna-card">
            {p.artworkUrl ? (
              <img
                src={p.artworkUrl}
                alt={p.name}
                className="pokemon-sprite"
                loading="lazy"
              />
            ) : p.spriteUrl ? (
              <img
                src={p.spriteUrl}
                alt={p.name}
                className="pokemon-sprite"
                loading="lazy"
              />
            ) : (
              <div
                className="pokemon-sprite"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                }}
              >
                🐾
              </div>
            )}
            <div className="pokemon-info">
              <div className="pokemon-name">
                #{p.id} {p.name}
              </div>
              <div className="pokemon-types">
                {p.types.map((type) => (
                  <span key={type} className={`type-badge ${type}`}>
                    {type}
                  </span>
                ))}
              </div>
              <div className="stat-bars">
                {Object.entries(STAT_LABELS).map(([key, label]) => {
                  const value = p.stats[key as keyof typeof p.stats] as number;
                  return (
                    <div key={key} className="stat-bar">
                      <span className="stat-name">{label}</span>
                      <div className="stat-track">
                        <div
                          className="stat-fill"
                          style={{
                            width: `${(value / 255) * 100}%`,
                            background: STAT_COLORS[key],
                          }}
                        />
                      </div>
                      <span className="stat-val">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
