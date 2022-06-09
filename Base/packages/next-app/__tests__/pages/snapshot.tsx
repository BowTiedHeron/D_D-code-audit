import React from "react";
import renderer from "react-test-renderer";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "wagmi";

import Index from "@/pages/index";
import { theme } from "@/chakra.config";

it("renders homepage unchanged", () => {
  const tree = renderer
    .create(
      <ChakraProvider theme={theme}>
        <Provider>
          <Index />
        </Provider>
      </ChakraProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
