import React from "react";
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_SUMMARY } from "../../graphql/queries/overview";
import { useNumberFormatter } from "../../hooks/useNumberFormatter";
import { RegionChart } from "./RegionChart";
import { LaunchYearChart } from "../launches/LaunchYearChart";
import type { DashboardSummary, RegionStats, LaunchStats } from "../../types";

interface SummaryData {
  dashboardSummary: DashboardSummary;
  regionStats: RegionStats[];
  launchStats: LaunchStats;
}

export const Overview: React.FC = () => {
  const { data, loading, error } = useQuery<SummaryData>(GET_DASHBOARD_SUMMARY);
  const fmt = useNumberFormatter();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Scanning galactic databases...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="error-container">
        <div style={{ fontSize: 48 }}>💥</div>
        <div>Failed to connect to galactic network</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{error?.message}</div>
      </div>
    );
  }

  const { dashboardSummary: summary, regionStats, launchStats } = data;

  return (
    <>
      <div className="fun-fact">
        <span className="fact-icon">🤓</span>
        <span>{summary.funFact}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🌍</span>
          <span className="stat-value">{summary.totalCountries}</span>
          <span className="stat-label">Known Civilizations</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{fmt(summary.totalPopulation)}</span>
          <span className="stat-label">Total Population</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🚀</span>
          <span className="stat-value">{summary.totalLaunches}</span>
          <span className="stat-label">Galactic Missions</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🐾</span>
          <span className="stat-value">{fmt(summary.totalPokemon)}</span>
          <span className="stat-label">Fauna Species</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-value" style={{ color: "var(--accent-green)" }}>
            {launchStats.successRate}%
          </span>
          <span className="stat-label">Launch Success Rate</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{launchStats.upcoming}</span>
          <span className="stat-label">Upcoming Missions</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Population by Region</span>
          </div>
          <div className="chart-container" style={{ height: 350 }}>
            <RegionChart data={regionStats} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Launch History</span>
          </div>
          <div className="chart-container" style={{ height: 350 }}>
            <LaunchYearChart data={launchStats.byYear} />
          </div>
        </div>
      </div>
    </>
  );
};
