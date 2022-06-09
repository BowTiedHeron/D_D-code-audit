import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  Spinner,
  Box,
} from "@chakra-ui/react";

export enum ButtonType {
  Connect = 1,
  Connected,
  Switch,
  Learn,
}

interface ButtonProps extends ChakraButtonProps {
  label: string;
  buttonType: ButtonType;
  onClick?: () => void;
}

export const Button = ({ buttonType, label, ...props }: ButtonProps) => {
  return (
    <ChakraButton
      type="button"
      backgroundColor={(() => {
        switch (buttonType) {
          case ButtonType.Connect:
            return "#fff";
          case ButtonType.Learn:
            return "transparent";
          case ButtonType.Switch:
            return "rgba(255, 255, 255, 0.08)";
        }
      })()}
      color={(() => {
        switch (buttonType) {
          case ButtonType.Connect:
            return "#000";
          case ButtonType.Learn:
            return "#fff";
          case ButtonType.Switch:
            return "#fff";
        }
      })()}
      fontSize={["16px", "18px"]}
      height="56px"
      lineHeight={["1.2em", "1.4em"]}
      fontWeight="900"
      border={"2px solid #fff"}
      borderRadius={"0.65rem"}
      padding="0 2.5rem"
      _hover={{
        transform:
          "translate3d(0px, -2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
        transformStyle: "preserve-3d",
      }}
      _active={{}}
      {...props}
    >
      <Box mt="-0.5">
        {buttonType == ButtonType.Switch ? <Spinner mr="5" /> : null}
        {label}
      </Box>
    </ChakraButton>
  );
};
