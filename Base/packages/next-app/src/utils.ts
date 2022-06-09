export const hasEthereum = () =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export const getContractAddress = () =>
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getTokenAddress = () =>
  process.env.NEXT_PUBLIC_CODE_CONTRACT_ADDRESS;

export const maskWalletAddress = (account: string | undefined) =>
  account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : "-";
