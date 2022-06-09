import { useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";

import { CODEToken, ClaimCODE__factory } from "@/typechain";
import { getContractAddress } from "@/utils";
import { ethers } from "ethers";

type ContractInfo = {
  claimPeriodEnds: Date | undefined;
  merkleRoot: string | undefined;
};

const contractAddress = getContractAddress();

const useContractInfo = (): ContractInfo => {
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    claimPeriodEnds: undefined,
    merkleRoot: undefined,
  });

  const provider = useProvider();
  useEffect(() => {
    const tokenContract = ClaimCODE__factory.connect(contractAddress, provider);

    const fetchContractInfo = async () => {
      const claimPeriodEndsRes = await tokenContract.claimPeriodEnds();
      const claimPeriodEndsDate = new Date(
        claimPeriodEndsRes.toNumber() * 1000,
      );

      const merkleRoot = await tokenContract.merkleRoot();

      setContractInfo({ claimPeriodEnds: claimPeriodEndsDate, merkleRoot });
    };

    if (provider) {
      fetchContractInfo();
    }
  }, [provider]);

  return contractInfo;
};

export default useContractInfo;
