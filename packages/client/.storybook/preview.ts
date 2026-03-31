import type { Preview } from "@storybook/react";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "galactic",
      values: [
        { name: "galactic", value: "#0a0e27" },
        { name: "dark", value: "#131738" },
        { name: "light", value: "#ffffff" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
