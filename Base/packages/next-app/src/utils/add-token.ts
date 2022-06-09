import { getTokenAddress } from "@/utils";

const tokenSymbol = "CODE";
const tokenDecimals = 18;
const tokenImage =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}/assets/devdao-logo_dark.svg`
    : "";

export async function addCodeToken(ethereum: any) {
  try {
    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: getTokenAddress(),
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}
