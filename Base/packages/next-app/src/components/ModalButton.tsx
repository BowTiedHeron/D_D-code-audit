import { Flex, Image, Text } from "@chakra-ui/react";

export interface ModalButtonConfig {
  id: string;
  backgroundColor: string;
  highlightColor: string;
  icon: string;
  iconSize: string;
  label: string;
}

export const ModalButton = ({
  config,
  onClick,
}: {
  config: ModalButtonConfig;
  onClick: () => void;
}) => (
  <Flex
    align="center"
    bg={config.backgroundColor}
    borderRadius="30px"
    outline="solid 1px transparent"
    transition="outline 0.25s ease-out"
    cursor="pointer"
    direction="column"
    justify="center"
    w="240px"
    h="240px"
    onClick={onClick}
    _hover={{
      outlineColor: config.highlightColor,
      outlineWidth: "2px",
    }}
  >
    <Flex align="center" justify="center" boxSize="116px">
      <Image
        src={config.icon}
        alt={config.label}
        boxSize={config.iconSize}
        mb="5px"
      />
    </Flex>
    <Text color="#CFCFCF" fontSize="16px" fontWeight="500">
      Connect with
    </Text>
    <Text color={config.highlightColor} fontSize="20px" fontWeight="500">
      {config.label}
    </Text>
  </Flex>
);
