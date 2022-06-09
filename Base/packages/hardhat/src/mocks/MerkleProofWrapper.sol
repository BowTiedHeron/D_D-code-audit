// SPDX-License-Identifier: MIT
// Modified from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.3.0/contracts/mocks/MerkleProofWrapper.sol

pragma solidity ^0.8.9;

import "../MerkleProof.sol";

contract MerkleProofWrapper {
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool, uint256) {
        return MerkleProof.verify(proof, root, leaf);
    }
}
