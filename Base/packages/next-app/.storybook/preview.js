import { theme } from "../src/chakra.config";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "main",
    values: [
      { name: "main", value: "#08010d" },
      { name: "light", value: "#fff" },
    ],
  },
  chakra: {
    theme,
  },
};
