import { extendTheme, keyframes } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  fonts: {
    heading: "'Zen Kaku Gothic New', sans-serif",
    body: "'Zen Kaku Gothic New', sans-serif",
  },
});

const bounce = keyframes`
        0%   { transform: translateY(0); }
        30%   { transform: translateY(0); }
        50%  { transform: translateY(-20px); }
        70%  { transform: translateY(0); }
        100% { transform: translateY(0); }
`;

export const bounceAnimation = `${bounce} infinite 1.5s ease`;
