import * as fs from 'fs';
import { ethers } from 'ethers';
import { getUnnamedAccounts } from 'hardhat';
import MerkleGenerator from '../utils/merkleGenerator';
import { generateLeaf } from '../test/utils/merkleUtils';

const TOKEN_DECIMALS = 18;
const TOKEN_AMOUNT_NFT = 400;
const TOKEN_AMOUNT_VOTES_POAP = 399;

const args = process.argv.slice(2);
const nftHoldersPath = args[0];
const votesAndPoapPath = args[1];

// TODO early contributors allocation, founding team, advisors, partners

if (!nftHoldersPath) throw new Error('Missing nftHoldersPath as first argument!');
if (!votesAndPoapPath) throw new Error('Missing earlyContribPath as second argument!');

async function main() {
  // Load addresses
  const nftHolders = JSON.parse(fs.readFileSync(nftHoldersPath).toString());
  const votersAndPoapHolders = JSON.parse(fs.readFileSync(votesAndPoapPath).toString());

  // Create the airdrop structure required by the generator
  const airdrop: Record<string, number> = {};

  // NFT Holders allocation
  nftHolders.addresses.forEach((address: string) => {
    const formattedAddress = ethers.utils.getAddress(address);

    airdrop[formattedAddress] = TOKEN_AMOUNT_NFT;
  });

  // Voters & POAP holders allocation
  votersAndPoapHolders.eligible_address.forEach(({ address }: { address: string }) => {
    const formattedAddress = ethers.utils.getAddress(address);

    if (!(formattedAddress in airdrop)) {
      airdrop[formattedAddress] = TOKEN_AMOUNT_VOTES_POAP;
    } else {
      airdrop[formattedAddress] += TOKEN_AMOUNT_VOTES_POAP;
    }
  });

  //fs.writeFileSync('data/airdrop.json', JSON.stringify(airdrop));

  // Add localhost addresses for testing
  const testAccounts = await getUnnamedAccounts();
  if (process.env.HARDHAT_NETWORK === 'localhost') {
    airdrop[ethers.utils.getAddress(testAccounts[0])] = TOKEN_AMOUNT_NFT;
    airdrop[ethers.utils.getAddress(testAccounts[1])] = TOKEN_AMOUNT_NFT + TOKEN_AMOUNT_VOTES_POAP;

    console.warn('Added test account allocations for:');
    console.warn(testAccounts[0], airdrop[ethers.utils.getAddress(testAccounts[0])]);
    console.warn(testAccounts[1], airdrop[ethers.utils.getAddress(testAccounts[1])]);
  }

  // Write the input airdrop to file, to use it exactly like this in the UI
  fs.writeFileSync(`data/out/airdrop_${process.env.HARDHAT_NETWORK}.json`, JSON.stringify({ airdrop }));

  // Create the generate & process it
  const generator = new MerkleGenerator(TOKEN_DECIMALS, airdrop);
  const { merkleRoot, merkleTree } = await generator.process();

  console.info(`Generated Merkle root: ${merkleRoot}`);

  const numTokens: string = ethers.utils.parseUnits(TOKEN_AMOUNT_NFT.toString(), TOKEN_DECIMALS).toString();
  const leaf: Buffer = generateLeaf(ethers.utils.getAddress(testAccounts[0]), numTokens);
  const proof: string[] = merkleTree.getHexProof(leaf);
  console.warn(proof);

  await fs.writeFileSync(
    // Output to merkle.json
    `data/out/Merkle_${process.env.HARDHAT_NETWORK}.json`,
    // Root + full tree
    JSON.stringify({
      root: merkleRoot,
      tree: merkleTree,
    })
  );

  console.info('Generated merkle tree and root saved to Merkle.json.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
