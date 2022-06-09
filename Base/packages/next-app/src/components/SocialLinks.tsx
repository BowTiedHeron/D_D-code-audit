import { Box, Flex, Link, Text } from "@chakra-ui/react";

interface SocialLinkProps {
  href: string;
  title: string;
}

const SocialLink = ({ href, title }: SocialLinkProps) => (
  <Link
    display="block"
    position="relative"
    href={href}
    isExternal
    _after={{
      content: '""',
      position: "absolute",
      bottom: "-0.7em",
      left: "5%",
      width: " 90%",
      height: "0.12em",
      backgroundColor: "#08010D",
      borderRadius: "0.06em",
      opacity: 0,
      transition: "opacity 200ms, transform 200ms",
    }}
    _hover={{
      _after: {
        opacity: 1,
        transform: "translate3d(0, -0.2em, 0)",
      },
    }}
  >
    <Text fontSize="18px" fontWeight="500" color="#08010D">
      {title}
    </Text>
  </Link>
);

export const SocialLinks = () => {
  return (
    <Flex align="center">
      <SocialLink
        href="https://github.com/Developer-DAO/code-claim-site"
        title="Contract"
      />
      <div
        style={{
          marginLeft: "60px",
          border: "1px solid rgba(78, 72, 83, 0.35)",
          borderRadius: "8px",
          height: "16px",
          marginTop: "2px",
        }}
      ></div>
      <Box ml="60px">
        <SocialLink href="https://discord.gg/devdao" title="Discord" />
      </Box>
      <Box ml="60px">
        <SocialLink href="https://twitter.com/developer_dao" title="Twitter" />
      </Box>
    </Flex>
  );
};
