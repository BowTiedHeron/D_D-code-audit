import { expect } from './chai-setup';
import { ethers, getUnnamedAccounts } from 'hardhat';
import { generateLeaf } from './utils/merkleUtils';
import { ClaimCODE } from '../../next-app/src/typechain';
import { setupUsers } from './utils';
import MerkleGenerator from '../utils/merkleGenerator';

const TOKEN_DECIMALS = 18;

describe('MerkleProof', function () {
  beforeEach(async function () {
    const merkleProofCf = await ethers.getContractFactory('MerkleProofWrapper');
    this.merkleProof = await merkleProofCf.deploy();
    await this.merkleProof.deployed();
    const unnamedAccounts = await getUnnamedAccounts();

    const ClaimCODE = <ClaimCODE>await ethers.getContract('ClaimCODE');
    this.users = await setupUsers(unnamedAccounts, { ClaimCODE });

    const airdrop = {
      [unnamedAccounts[1]]: 100,
      [unnamedAccounts[2]]: 200,
      [unnamedAccounts[3]]: 300,
    };

    const generator = new MerkleGenerator(TOKEN_DECIMALS, airdrop);
    const { merkleRoot, merkleTree } = await generator.process();
    this.merkleRoot = merkleRoot;
    this.merkleTree = merkleTree;
  });

  describe('verify', function () {
    it('returns true and index 0 for a valid Merkle proof', async function () {
      const formattedAddress: string = ethers.utils.getAddress(this.users[1].address);
      const numTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();
      const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
      const proof: string[] = this.merkleTree.getHexProof(leaf);

      const result = await this.merkleProof.verify(proof, this.merkleRoot, leaf);

      expect(result[0]).to.be.true;
      expect(result[1].toNumber()).to.equal(0);
    });

    it('returns true and index 2 for a valid Merkle proof', async function () {
      const formattedAddress: string = ethers.utils.getAddress(this.users[2].address);
      const numTokens: string = ethers.utils.parseUnits('200', TOKEN_DECIMALS).toString();
      const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
      const proof: string[] = this.merkleTree.getHexProof(leaf);

      const result = await this.merkleProof.verify(proof, this.merkleRoot, leaf);

      expect(result[0]).to.be.true;
      expect(result[1].toNumber()).to.equal(2);
    });

    it('returns false for an invalid Merkle proof - incorect user', async function () {
      const formattedAddress: string = ethers.utils.getAddress(this.users[0].address);
      const numTokens: string = ethers.utils.parseUnits('100', TOKEN_DECIMALS).toString();
      const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
      const proof: string[] = this.merkleTree.getHexProof(leaf);

      const result = await this.merkleProof.verify(proof, this.merkleRoot, leaf);

      expect(result[0]).to.be.false;
      expect(result[1].toNumber()).to.equal(0);
    });
  });

  it('returns false for a invalid Merkle proof - incorrect ammount', async function () {
    const formattedAddress: string = ethers.utils.getAddress(this.users[1].address);
    const numTokens: string = ethers.utils.parseUnits('999', TOKEN_DECIMALS).toString();
    const leaf: Buffer = generateLeaf(formattedAddress, numTokens);
    const proof: string[] = this.merkleTree.getHexProof(leaf);

    const result = await this.merkleProof.verify(proof, this.merkleRoot, leaf);

    expect(result[0]).to.be.false;
    expect(result[1].toNumber()).to.equal(0);
  });
});
