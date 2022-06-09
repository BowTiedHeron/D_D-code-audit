import { ethers, getNamedAccounts } from 'hardhat';
import { ClaimCODE } from '../../next-app/src/typechain';

const args = process.argv.slice(2);
const merkleRoot = args[0];

async function main() {
  const { treasury } = await getNamedAccounts();

  const claimContract = <ClaimCODE>await ethers.getContract('ClaimCODE', treasury);
  const tx = await claimContract.setMerkleRoot(merkleRoot);
  console.log(`Setting merkle root "${merkleRoot}"`);
  await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
