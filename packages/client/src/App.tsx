import React from "react";
import { useAppSelector } from "./store";
import { Sidebar } from "./layout/Sidebar";
import { ContentArea } from "./layout/ContentArea";
import { Overview } from "./features/overview/Overview";
import { WorldBubbleChart } from "./features/world/WorldBubbleChart";
import { LaunchTimeline } from "./features/launches/LaunchTimeline";
import { FaunaRegistry } from "./features/pokemon/FaunaRegistry";
import { CountryGrid } from "./features/world/CountryGrid";
import { FaunaVsNations } from "./features/analytics/FaunaVsNations";
import type { DashboardView } from "./types";

const VIEW_COMPONENTS: Record<DashboardView, React.FC> = {
  overview: Overview,
  world: WorldBubbleChart,
  launches: LaunchTimeline,
  fauna: FaunaRegistry,
  grid: CountryGrid,
  "fauna-vs-nations": FaunaVsNations,
};

const App: React.FC = () => {
  const currentView = useAppSelector((s) => s.dashboard.currentView);
  const ViewComponent = VIEW_COMPONENTS[currentView];

  return (
    <div className="app-layout">
      <Sidebar />
      <ContentArea>
        <ViewComponent />
      </ContentArea>
    </div>
  );
};

export default App;
