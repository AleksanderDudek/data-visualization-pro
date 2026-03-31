import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setView } from "../store/slices/dashboardSlice";
import type { DashboardView } from "../types";

const NAV_ITEMS: { view: DashboardView; icon: string; label: string }[] = [
  { view: "overview", icon: "📊", label: "Mission Control" },
  { view: "world", icon: "🌍", label: "World Explorer" },
  { view: "launches", icon: "🚀", label: "Launch Timeline" },
  { view: "fauna", icon: "🐾", label: "Fauna Registry" },
  { view: "grid", icon: "📋", label: "Data Grid" },
  { view: "fauna-vs-nations", icon: "⚔️", label: "Fauna vs Nations" },
];

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((s) => s.dashboard.currentView);
  const collapsed = useAppSelector((s) => s.dashboard.sidebarCollapsed);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <span className="logo">🌌</span>
        <span className="title">GALACTIC DATA</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            className={`nav-item ${currentView === item.view ? "active" : ""}`}
            onClick={() => dispatch(setView(item.view))}
            title={item.label}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
