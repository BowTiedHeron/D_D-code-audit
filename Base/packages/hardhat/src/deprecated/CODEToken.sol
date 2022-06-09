//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

import "hardhat/console.sol";

contract CODEToken is ERC20, ERC20Permit, Ownable {
    using BitMaps for BitMaps.BitMap;
    BitMaps.BitMap private claimed;
    bytes32 public merkleRoot;
    uint256 public claimPeriodEnds;
    address public treasury;
    bool public mintingEnabled = true;

    event MerkleRootChanged(bytes32 merkleRoot);
    event Claim(address indexed claimant, uint256 amount);

    constructor(
        address _treasury,
        uint256 treasurySupply,
        uint256 airdropSupply,
        uint256 _claimPeriodEnds
    ) ERC20("Developer DAO", "CODE") ERC20Permit("Developer DAO") {
        _mint(_treasury, treasurySupply * (10**18));
        _mint(address(this), airdropSupply * (10**18));
        treasury = _treasury;
        claimPeriodEnds = _claimPeriodEnds;
    }

    function claimTokens(uint256 amount, bytes32[] calldata merkleProof) external {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        (bool valid, uint256 index) = MerkleProof.verify(merkleProof, merkleRoot, leaf);
        require(block.timestamp <= claimPeriodEnds, "CODE: Claim period ends");
        require(valid, "CODE: Valid proof required.");
        require(!isClaimed(index), "CODE: Tokens already claimed.");

        console.log("Trying to claim %s tokens to %s", amount, msg.sender);

        claimed.set(index);
        emit Claim(msg.sender, amount);

        _transfer(address(this), msg.sender, amount);
    }

    function isClaimed(uint256 index) public view returns (bool) {
        return claimed.get(index);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        require(merkleRoot == bytes32(0), "CODE: Merkle root already set");
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }

    function sweep() external onlyOwner {
        require(block.timestamp > claimPeriodEnds, "CODE: Claim period not yet ended");
        _transfer(address(this), treasury, balanceOf(address(this)));
    }

    function disableMinting() public onlyOwner {
        mintingEnabled = false;
    }

    function mint(uint256 additionalSupply) public onlyOwner {
        require(mintingEnabled == true, "CODE: No new tokens can be minted");
        _mint(msg.sender, additionalSupply * (10**18));
    }
}
