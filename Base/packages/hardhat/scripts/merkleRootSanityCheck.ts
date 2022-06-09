import { ethers, getNamedAccounts } from 'hardhat';
import { ClaimCODE } from '../../next-app/src/typechain';
import airdropData from '../../next-app/src/data/airdrop';
import { generateMerkleTree, getMerkleTreeValues, verify } from '../../next-app/src/utils/merkletree';
import { assert } from 'console';

// the sanity check data is directly from the frontend in production
const airdrop: Record<string, { nft: number; voter: number; earlyContrib: number }> = airdropData.airdrop;

const merkleTree = generateMerkleTree(airdrop);

console.info(`Generated Merkle root: ${merkleTree.getHexRoot()}`);

async function main() {
  const { treasury } = await getNamedAccounts();

  const claimContract = <ClaimCODE>await ethers.getContract('ClaimCODE', treasury);
  console.log('claim contract address:', claimContract.address);
  console.log('merkle root:', await claimContract.merkleRoot());

  const arr = Object.entries(airdrop);

  const idxEntries = new Set<number>();

  for (let idx = 0; idx < arr.length; idx++) {
    await (async () => {
      const [address, allocation] = arr[idx];

      const totalAllocation = allocation.nft + allocation.voter + allocation.earlyContrib;
      const { leaf, proof } = getMerkleTreeValues(merkleTree, address, totalAllocation);
      const [isVerifiedLocal, indexLocal] = verify(proof, merkleTree.getHexRoot(), '0x' + leaf.toString('hex'));
      const [isVerified, index] = await claimContract.verify(proof, leaf);

      // ensure the verify logic used in frontend is exactly the same with the contract
      assert(isVerifiedLocal);
      assert(isVerified);
      assert(indexLocal == index.toNumber());
      assert(indexLocal > 0);

      idxEntries.add(index.toNumber());
      console.log(`sanity checked for ${address}`);
    })();
  }

  // ensure each idx is unique
  assert(idxEntries.size == arr.length);
  console.log('sanity checked for indexes');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
