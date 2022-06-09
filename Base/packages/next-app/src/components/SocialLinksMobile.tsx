import { Flex, Image, Link } from "@chakra-ui/react";

interface SocialLinkMobileProps {
  icon: string;
  iconAlt: string;
}

const SocialLinkMobile = ({ icon, iconAlt }: SocialLinkMobileProps) => (
  <Image src={icon} alt={iconAlt} w="32px" h="32px" />
);

export const SocialLinksMobile = () => {
  return (
    <Flex align="center">
      <Link href="https://github.com/Developer-DAO/code-claim-site" isExternal>
        <SocialLinkMobile
          icon="assets/github-icon.svg"
          iconAlt="Contract link"
        />
      </Link>
      <Link href="https://discord.gg/devdao" isExternal ml="32px">
        <SocialLinkMobile icon="assets/discord-icon.svg" iconAlt="Discord" />
      </Link>
      <Link href="https://twitter.com/developer_dao" isExternal ml="32px">
        <SocialLinkMobile icon="assets/twitter-icon.svg" iconAlt="Twitter" />
      </Link>
    </Flex>
  );
};
