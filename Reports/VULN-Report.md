**Table of Contents:**

- [Use safeTransfer/safeTransferFrom consistently instead of transfer/transferFrom](#use-safetransfersafetransferfrom-consistently-instead-of-transfertransferfrom)
- [Using `transferFrom` on ERC721 tokens](#using-transferfrom-on-erc721-tokens)
- [Prevent accidentally burning tokens](#prevent-accidentally-burning-tokens)
- [Use a more recent version of solidity](#use-a-more-recent-version-of-solidity)
- [`abi.encodePacked()` should not be used with dynamic types when passing the result to a hash function such as `keccak256()`](#abiencodepacked-should-not-be-used-with-dynamic-types-when-passing-the-result-to-a-hash-function-such-as-keccak256)
- [`ClaimCODE.sol` should implement a 2-step ownership transfer pattern](#claimcodesol-should-implement-a-2-step-ownership-transfer-pattern)
- [Events not indexed](#events-not-indexed)
- [It's better to emit after all processing is done](#its-better-to-emit-after-all-processing-is-done)
- [Avoid floating pragmas: the version should be locked](#avoid-floating-pragmas-the-version-should-be-locked)

## Use safeTransfer/safeTransferFrom consistently instead of transfer/transferFrom

It is good to add a require() statement that checks the return value of token transfers or to use something like OpenZeppelin’s safeTransfer/safeTransferFrom unless one is sure the given token reverts in case of a failure. Failure to do so will cause silent failures of transfers and affect token accounting in contract.

Reference: This similar medium-severity finding from Consensys Diligence Audit of Fei Protocol: <https://consensys.net/diligence/audits/2021/01/fei-protocol/#unchecked-return-value-for-iweth-transfer-call>

Consider using safeTransfer/safeTransferFrom or require() consistently:

```solidity
packages/hardhat/src/ClaimCODE.sol:
  71:         token.transfer(owner(), token.balanceOf(address(this))); //@audit result of transfer not checked

packages/hardhat/src/CODE.sol:
  30:         token.transfer(_to, token.balanceOf(address(this))); //@audit result of transfer not checked
```

## Using `transferFrom` on ERC721 tokens

The `transferFrom` keyword is used instead of `safeTransferFrom`. If the arbitrary address is a contract and is not aware of the incoming ERC721 token, the sent token could be locked.

I suggest transitioning from `transferFrom` to `safeTransferFrom` here:

```solidity
packages/hardhat/src/CODE.sol:
  40:         token.transferFrom(address(this), _to, _tokenID); 
```

## Prevent accidentally burning tokens

Transferring tokens to the zero address is usually prohibited to accidentally avoid "burning" tokens by sending them to an unrecoverable zero address.

Consider adding a check to prevent accidentally burning tokens here:

```solidity
packages/hardhat/src/CODE.sol:
  30:         token.transfer(_to, token.balanceOf(address(this)));
```

## Use a more recent version of solidity

```solidity
packages/hardhat/src/ClaimCODE.sol:
   2: pragma solidity ^0.8.9;
  46:         bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

packages/hardhat/src/MerkleProof.sol:
   4: pragma solidity ^0.8.9;
  36:                 computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
  39:                 computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
```

## `abi.encodePacked()` should not be used with dynamic types when passing the result to a hash function such as `keccak256()`

Same finding from other contests:

- <https://github.com/code-423n4/2021-09-wildcredit-findings/issues/4>
- <https://code4rena.com/reports/2022-04-backd#:~:text=ConvexStrategyBase.sol%23L261-,%5BL%2D07%5D,-ABI.ENCODEPACKED>()

Mitigation 1: Use a solidity version of at least 0.8.12 to get `string.concat()` to be used instead of `abi.encodePacked(<str>,<str>)`
Mitigation 2: Use `abi.encode()` instead which will pad items to 32 bytes, which will prevent hash collisions (e.g. `abi.encodePacked(0x123,0x456)` => `0x123456` => `abi.encodePacked(0x1,0x23456)`, but `abi.encode(0x123,0x456)` => `0x0...1230...456`). If there is only one argument to `abi.encodePacked()` it can often be cast to `bytes()` or `bytes32()` instead.

```solidity
packages/hardhat/src/ClaimCODE.sol:
   2: pragma solidity ^0.8.9;
  46:         bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

packages/hardhat/src/MerkleProof.sol:
   4: pragma solidity ^0.8.9;
  36:                 computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
  39:                 computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
```

## `ClaimCODE.sol` should implement a 2-step ownership transfer pattern

```solidity
packages/hardhat/src/ClaimCODE.sol:
   5: import "@openzeppelin/contracts/access/Ownable.sol";
  13: contract ClaimCODE is Ownable, Pausable {
```

This contract inherits from OpenZeppelin's libraries and the `transferOwnership()` function is the default one (a one-step process). It's possible that the `onlyOwner` role mistakenly transfers ownership to a wrong address, resulting in a loss of the `onlyOwner` role. Consider overriding the default `transferOwnership()` function to first nominate an address as the pending owner and implementing an `acceptOwnership()` function which is called by the pending owner to confirm the transfer.

## Events not indexed

```solidity
File: /Users/ravidaiman/Documents/github/contests/code-claim-site/packages/hardhat/src/ClaimCODE.sol
25:     event Sweep20(address _token);
26:     event Sweep721(address _token, uint256 _tokenID);
```

## It's better to emit after all processing is done

```solidity
File: /Users/ravidaiman/Documents/github/contests/code-claim-site/packages/hardhat/src/ClaimCODE.sol
45:     function claimTokens(uint256 _amount, bytes32[] calldata _merkleProof) external whenNotPaused {
....
53:         emit Claim(msg.sender, _amount); //@audit it's better to emit after all is done. Move this further down
54: 
55:         codeToken.transfer(msg.sender, _amount);
56:     }

```

## Avoid floating pragmas: the version should be locked

```solidity
File: /Users/ravidaiman/Documents/github/contests/code-claim-site/packages/hardhat/src/low.md
183: ClaimCODE.sol:2:pragma solidity ^0.8.9;
184: CODE.sol:2:pragma solidity ^0.8.9;
185: MerkleProof.sol:4:pragma solidity ^0.8.9;
```
