import { expect } from '../chai-setup';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { CODEToken } from '../../../next-app/src/typechain';
import { setupUsers } from '../utils';
import { generateLeaf } from '../utils/merkleUtils';

import MerkleGenerator from '../../utils/merkleGenerator';

const TOKEN_DECIMALS = 18;

const setup = deployments.createFixture(async () => {
  await deployments.fixture(['CODEToken']);

  const unnamedAccounts = await getUnnamedAccounts();
  const airdrop = {
    [unnamedAccounts[1]]: 100,
    [unnamedAccounts[2]]: 200,
    [unnamedAccounts[3]]: 300,
  };
  console.log(airdrop);

  const generator = new MerkleGenerator(TOKEN_DECIMALS, airdrop);
  const { merkleRoot, merkleTree } = await generator.process();

  const CODEToken = <CODEToken>await ethers.getContract('CODEToken');
  const users = await setupUsers(unnamedAccounts, { CODEToken });

  await CODEToken.setMerkleRoot(merkleRoot);

  return {
    CODEToken,
    merkleTree,
    users,
    merkleRoot,
  };
});

describe('CODEToken', function () {
  it('Deployment should assign treasury & airdrop supply of tokens correctly', async function () {
    await deployments.fixture(['CODEToken']);
    const { treasury } = await getNamedAccounts();
    const Token = <CODEToken>await ethers.getContract('CODEToken');
    const treasuryBalance = await Token.balanceOf(treasury);
    const airdropBalance = await Token.balanceOf(Token.address);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((6_500_000).toString(), TOKEN_DECIMALS));
    expect(airdropBalance).to.equal(ethers.utils.parseUnits((3_500_000).toString(), TOKEN_DECIMALS));
  });

  it('cannot claim if no allocation', async function () {
    const { users, merkleTree } = await setup();

    // Get properly formatted address
    const formattedAddress: string = ethers.utils.getAddress(users[0].address);

    // Get tokens for address
    const numTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
    // Generate airdrop proof
    const proof: string[] = merkleTree.getHexProof(leaf);

    await expect(users[0].CODEToken.claimTokens(numTokens, proof)).to.be.revertedWith('CODE: Valid proof required.');
  });

  it('can claim correct allocation amount only', async function () {
    const { users, merkleTree, CODEToken } = await setup();

    const isClaimed = await CODEToken.isClaimed(0);
    expect(isClaimed).to.be.false;

    // Get tokens for address correctly
    const correctFormattedAddress: string = ethers.utils.getAddress(users[1].address);
    const correctNumTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();
    const correctLeaf: Buffer = generateLeaf(correctFormattedAddress, correctNumTokens);
    const correctProof: string[] = merkleTree.getHexProof(correctLeaf);

    await expect(users[1].CODEToken.claimTokens(correctNumTokens, correctProof))
      .to.emit(CODEToken, 'Claim')
      .withArgs(correctFormattedAddress, ethers.utils.parseUnits((100).toString(), TOKEN_DECIMALS));

    const userBalance = await CODEToken.balanceOf(users[1].address);
    expect(userBalance).to.equal(ethers.utils.parseUnits((100).toString(), TOKEN_DECIMALS));

    const isClaimedAfter = await CODEToken.isClaimed(0);
    expect(isClaimedAfter).to.be.true;

    await expect(users[1].CODEToken.claimTokens(correctNumTokens, correctProof)).to.be.revertedWith(
      'CODE: Tokens already claimed.'
    );

    // Get tokens for address incorrectly using user[2]
    /* const otherFormattedAddress: string = ethers.utils.getAddress(users[2].address);
    const wrongNumTokens: string = ethers.utils.parseUnits('123', TOKEN_DECIMALS).toString();
    const wrongLeaf: Buffer = generateLeaf(otherFormattedAddress, wrongNumTokens);
    const wrongProof: string[] = merkleTree.getHexProof(wrongLeaf);
    await expect(users[2].CODEToken.claimTokens(wrongNumTokens, wrongProof)).to.be.revertedWith(
      'CODE: Valid proof required.'
    ); */
  });

  it('cannot claim if minting disabled', async function () {
    await deployments.fixture(['CODEToken']);
    const { deployer } = await getNamedAccounts();
    const Token = <CODEToken>await ethers.getContract('CODEToken');
    const ownerBalance = await Token.balanceOf(deployer);
    expect(ownerBalance).to.equal(ethers.utils.parseUnits((0).toString(), TOKEN_DECIMALS));
    await Token.mint(100);
    const ownerBalanceAfter = await Token.balanceOf(deployer);
    expect(ownerBalanceAfter).to.equal(ethers.utils.parseUnits((100).toString(), TOKEN_DECIMALS));
    await Token.disableMinting();
    await expect(Token.mint(100)).to.be.revertedWith('CODE: No new tokens can be minted');
  });

  it('cannot claim if claim period ends', async function () {
    const { users, merkleTree } = await setup();
    // Get properly formatted address
    const formattedAddress: string = ethers.utils.getAddress(users[0].address);

    // Get tokens for address
    const numTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
    // Generate airdrop proof
    const proof: string[] = merkleTree.getHexProof(leaf);
    const ninetyOneDays = 91 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [ninetyOneDays]);

    await expect(users[0].CODEToken.claimTokens(numTokens, proof)).to.be.revertedWith('CODE: Claim period ends');
  });

  it('cannot sweep if claim period not ends', async function () {
    const { CODEToken } = await setup();

    await expect(CODEToken.sweep()).to.be.revertedWith('CODE: Claim period not yet ended');

    const ninetyOneDays = 91 * 24 * 60 * 60;
    await ethers.provider.send('evm_increaseTime', [ninetyOneDays]);

    await CODEToken.sweep();

    const { treasury } = await getNamedAccounts();
    const treasuryBalance = await CODEToken.balanceOf(treasury);
    expect(treasuryBalance).to.equal(ethers.utils.parseUnits((10_000_000).toString(), TOKEN_DECIMALS));
  });

  it('cannot reset merkleroot', async function () {
    const { CODEToken, merkleRoot } = await setup();
    await expect(CODEToken.setMerkleRoot(merkleRoot)).to.be.revertedWith('CODE: Merkle root already set');
  });
});
