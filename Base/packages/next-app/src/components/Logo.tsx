import { Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";

export const Logo = () => {
  const sm = "web";
  const breakpointValue = useBreakpointValue({ base: "mobile", sm });
  const isWeb = breakpointValue === sm;

  return (
    <Flex align="center">
      <Image
        src="assets/devdao-logo.svg"
        alt="Developer DAO logo"
        w="48px"
        h="48px"
        mr="16px"
      />
      {isWeb && (
        <Text color="white" fontSize="24px" fontWeight="500">
          Developer DAO
        </Text>
      )}
    </Flex>
  );
};
