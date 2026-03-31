import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Sidebar } from "./Sidebar";
import { dashboardSlice } from "../store/slices/dashboardSlice";
import { filtersSlice } from "../store/slices/filtersSlice";

const createMockStore = (view = "overview") =>
  configureStore({
    reducer: {
      dashboard: dashboardSlice.reducer,
      filters: filtersSlice.reducer,
    },
    preloadedState: {
      dashboard: {
        currentView: view as any,
        selectedCountryCode: null,
        selectedPokemonId: null,
        sidebarCollapsed: false,
      },
    },
  });

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => {
      const store = createMockStore((context.args as any)?.activeView);
      return (
        <Provider store={store}>
          <div style={{ height: "100vh", display: "flex" }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar & { activeView?: string }>;

export const Default: Story = {};

export const LaunchesActive: Story = {
  args: { activeView: "launches" } as any,
};

export const FaunaActive: Story = {
  args: { activeView: "fauna" } as any,
};
