import type { Meta, StoryObj } from "@storybook/react";
import { LaunchYearChart } from "./LaunchYearChart";

const meta: Meta<typeof LaunchYearChart> = {
  title: "Features/Launches/LaunchYearChart",
  component: LaunchYearChart,
  parameters: {
    layout: "padded",
  },
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
type Story = StoryObj<typeof LaunchYearChart>;

const mockLaunchYears = [
  { year: 2006, count: 1, successes: 0, failures: 1 },
  { year: 2007, count: 1, successes: 0, failures: 1 },
  { year: 2008, count: 2, successes: 1, failures: 1 },
  { year: 2009, count: 1, successes: 1, failures: 0 },
  { year: 2010, count: 2, successes: 2, failures: 0 },
  { year: 2012, count: 2, successes: 2, failures: 0 },
  { year: 2013, count: 3, successes: 3, failures: 0 },
  { year: 2014, count: 6, successes: 6, failures: 0 },
  { year: 2015, count: 7, successes: 6, failures: 1 },
  { year: 2016, count: 9, successes: 8, failures: 1 },
  { year: 2017, count: 18, successes: 18, failures: 0 },
  { year: 2018, count: 21, successes: 21, failures: 0 },
  { year: 2019, count: 13, successes: 13, failures: 0 },
  { year: 2020, count: 26, successes: 26, failures: 0 },
  { year: 2021, count: 31, successes: 31, failures: 0 },
  { year: 2022, count: 61, successes: 60, failures: 1 },
  { year: 2023, count: 96, successes: 95, failures: 1 },
];

export const Default: Story = {
  args: {
    data: mockLaunchYears,
  },
};

export const EarlyYears: Story = {
  args: {
    data: mockLaunchYears.slice(0, 8),
  },
};
