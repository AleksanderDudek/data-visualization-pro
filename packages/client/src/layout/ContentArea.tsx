import React from "react";
import { useAppSelector } from "../store";
import type { DashboardView } from "../types";

const VIEW_TITLES: Record<DashboardView, { title: string; subtitle: string }> = {
  overview: { title: "📊 Mission Control", subtitle: "Galactic Overview" },
  world: { title: "🌍 World Explorer", subtitle: "Planetary Civilizations Database" },
  launches: { title: "🚀 Launch Timeline", subtitle: "Galactic Transport Division" },
  fauna: { title: "🐾 Fauna Registry", subtitle: "Known Species Database" },
  grid: { title: "📋 Data Grid", subtitle: "Full Country Dataset" },
  "fauna-vs-nations": { title: "⚔️ Fauna vs Nations", subtitle: "The Absurd Comparison Engine" },
};

interface LayoutProps {
  children: React.ReactNode;
}

export const ContentArea: React.FC<LayoutProps> = ({ children }) => {
  const currentView = useAppSelector((s) => s.dashboard.currentView);
  const { title, subtitle } = VIEW_TITLES[currentView];

  return (
    <main className="main-content">
      <header className="content-header">
        <h1>
          {title}
          <span className="subtitle">{subtitle}</span>
        </h1>
      </header>
      <div className="content-body">{children}</div>
    </main>
  );
};
