import { Box, Flex, Text, Link, keyframes } from "@chakra-ui/react";

import { WarningTwoIcon } from "@chakra-ui/icons";
import { bounceAnimation } from "@/chakra.config";

export const ErrorToast = ({
  message,
  link_message,
  link,
}: {
  message: string;
  link_message?: string;
  link?: string;
}) => (
  <Box
    color="#FFFFFF"
    p={2}
    mb={10}
    mr={10}
    bg="#08010D"
    borderRadius="lg"
    border="2px"
    borderColor="#FF0042"
    animation={bounceAnimation}
  >
    <Flex mx="5" alignItems={"center"}>
      <WarningTwoIcon mr="5" color="#FF0042" />
      <Text fontSize="sm">
        {message}
        {link && link_message && <Link href={link}>{link_message}</Link>}
      </Text>
    </Flex>
  </Box>
);
