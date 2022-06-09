import { Box, Flex, Text, Link, keyframes } from "@chakra-ui/react";

import { InfoOutlineIcon } from "@chakra-ui/icons";

export const InfoToast = ({
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
    borderColor="#FFFFFF"
  >
    <Flex mx="5" alignItems={"center"}>
      <InfoOutlineIcon mr="5" color="#FFFFFF" />
      <Text fontSize="sm">
        {message}
        <Link href={link}>{link_message}</Link>
      </Text>
    </Flex>
  </Box>
);
