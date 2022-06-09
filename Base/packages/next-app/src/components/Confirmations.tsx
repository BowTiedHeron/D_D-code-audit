import { useEffect } from "react";
import useConfirmations from "../hooks/useConfirmations";

interface ConfirmationsType {
  hash: string | undefined;
}

/**
 *
 * @param hash - Takes in a transaction block hash
 * @returns a <p> that shows the block confirmations
 *
 * Example usage = <Confirmations hash="0x2417d52765ce3b893b978c8521a20607bf4c3cabcb33ae2073e9056d397dec22" />
 */
export const Confirmations = ({ hash }: ConfirmationsType) => {
  const confirmations = useConfirmations(hash, 20);

  useEffect(() => {}, [confirmations]);

  return <p>{confirmations} block confirmations</p>;
};
