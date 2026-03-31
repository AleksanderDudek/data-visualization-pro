import type { Meta, StoryObj } from "@storybook/react";
import { RegionChart } from "./RegionChart";

const meta: Meta<typeof RegionChart> = {
  title: "Features/Overview/RegionChart",
  component: RegionChart,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: 400, background: "var(--bg-card)", borderRadius: 12, padding: 20 }}>
        <div style={{ width: "100%", height: "100%" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RegionChart>;

const mockRegionStats = [
  { region: "Asia", countryCount: 50, totalPopulation: 4_700_000_000, avgPopulation: 94_000_000, totalArea: 44_580_000 },
  { region: "Africa", countryCount: 54, totalPopulation: 1_400_000_000, avgPopulation: 25_925_925, totalArea: 30_370_000 },
  { region: "Europe", countryCount: 44, totalPopulation: 750_000_000, avgPopulation: 17_045_454, totalArea: 10_180_000 },
  { region: "Americas", countryCount: 35, totalPopulation: 1_030_000_000, avgPopulation: 29_428_571, totalArea: 42_549_000 },
  { region: "Oceania", countryCount: 14, totalPopulation: 45_000_000, avgPopulation: 3_214_285, totalArea: 8_526_000 },
];

export const Default: Story = { args: { data: mockRegionStats } };
export const SmallDataset: Story = { args: { data: mockRegionStats.slice(0, 3) } };
