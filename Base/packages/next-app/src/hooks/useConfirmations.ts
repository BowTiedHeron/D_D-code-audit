import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useBlockNumber, useWaitForTransaction } from "wagmi";

type BlockConfirmations = number | undefined;

const useConfirmations = (
  txHash: string | undefined,
  watchBlocksCount: number,
): number | undefined => {
  const [{ data: waitTransaction }] = useWaitForTransaction({
    hash: txHash,
  });

  const [confirmations, setConfirmations] = useState<BlockConfirmations>(0);

  const shouldWatchBlocks = !confirmations || confirmations < watchBlocksCount;

  const [{ data: currentBlockNumber }] = useBlockNumber({
    watch: shouldWatchBlocks,
  });

  useEffect(() => {
    if (
      shouldWatchBlocks &&
      typeof currentBlockNumber !== "undefined" &&
      waitTransaction?.blockNumber
    ) {
      let blockConfirmations = currentBlockNumber - waitTransaction.blockNumber;
      setConfirmations(blockConfirmations < 0 ? 0 : blockConfirmations);
    }
  }, [shouldWatchBlocks, waitTransaction, currentBlockNumber]);

  return confirmations;
};

export default useConfirmations;
