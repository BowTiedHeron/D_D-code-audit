import { Box, Flex, Text, Link, keyframes } from "@chakra-ui/react";

import { CheckIcon } from "@chakra-ui/icons";

export const ConfirmToast = ({
  message,
  link_message,
  link,
}: {
  message: string;
  link_message: string;
  link: string;
}) => (
  <Box
    color="#FFFFFF"
    p={2}
    mb={10}
    mr={10}
    bg="#08010D"
    borderRadius="lg"
    border="2px"
    borderColor="#1AECAD"
  >
    <Flex mx="5" alignItems={"center"}>
      <CheckIcon mr="5" color="#1AECAD" />
      <Text fontSize="sm">
        {message}
        <Link ml={1} href={link}>
          {link_message}
        </Link>
      </Text>
    </Flex>
  </Box>
);
