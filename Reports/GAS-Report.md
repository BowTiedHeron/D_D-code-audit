**Table of Contents:**

- [Remove import: `hardhat/console.sol`](#remove-import-hardhatconsolesol)
- [Use `msg.sender` instead of OpenZeppelin's `_msgSender()`](#use-msgsender-instead-of-openzeppelins-_msgsender)
- [Amounts should be checked for 0 before calling a transfer](#amounts-should-be-checked-for-0-before-calling-a-transfer)
- [An array's length should be cached to save gas in for-loops](#an-arrays-length-should-be-cached-to-save-gas-in-for-loops)
- [`++i` costs less gas compared to `i++` or `i += 1` (same for `--i` vs `i--` or `i -= 1`)](#i-costs-less-gas-compared-to-i-or-i--1-same-for---i-vs-i---or-i---1)
- [Increments/decrements can be unchecked in for-loops](#incrementsdecrements-can-be-unchecked-in-for-loops)
- [No need to explicitly initialize variables with default values](#no-need-to-explicitly-initialize-variables-with-default-values)
- [Functions guaranteed to revert when called by normal users can be marked `payable`](#functions-guaranteed-to-revert-when-called-by-normal-users-can-be-marked-payable)

## Remove import: `hardhat/console.sol`

Before deployment (or before an audit), consider removing this import:

```solidity
File: /Users/ravidaiman/Documents/github/contests/code-claim-site/packages/hardhat/src/ClaimCODE.sol
11: import "hardhat/console.sol"; //@audit : this is debug-code. Remove it
```

## Use `msg.sender` instead of OpenZeppelin's `_msgSender()`

`msg.sender` costs 2 gas (CALLER opcode).
`_msgSender()` represents the following:

```solidity
File: @openzeppelin/contracts/utils/Context.sol
17:     function _msgSender() internal view virtual returns (address) {
18:         return msg.sender;
19:     }
```

When no GSN capabilities are used: `msg.sender` is enough.

See <https://docs.openzeppelin.com/contracts/2.x/gsn> for more information about GSN capabilities.

Affected code (see `@audit` tag):

```solidity
File: CODE.sol
19:     constructor(address _treasury) ERC20("Developer DAO", "CODE") ERC20Permit("Developer DAO") {
20:         _setupRole(DEFAULT_ADMIN_ROLE, _treasury);
21:         _mint(_msgSender(), 10_000_000 * 1e18); //@audit gas: Replace `_msgSender()` with `msg.sender`
22:     }
```

## Amounts should be checked for 0 before calling a transfer

Checking non-zero transfer values can avoid an expensive external call and save gas.  

I suggest adding a non-zero-value check here:

```solidity  
packages/hardhat/src/ClaimCODE.sol:
  55:         codeToken.transfer(msg.sender, _amount);

packages/hardhat/src/CODE.sol:
  50:         super._afterTokenTransfer(_from, _to, _amount);
```  

## An array's length should be cached to save gas in for-loops

Reading array length at each iteration of the loop consumes more gas than necessary.
  
In the best case scenario (length read on a memory variable), caching the array length in the stack saves around 3 gas per iteration.
In the worst case scenario (external calls at each iteration), the amount of gas wasted can be massive.

Here, I suggest storing the array's length in a variable before the for-loop, and use this new variable instead:

```solidity
MerkleProof.sol:30:        for (uint256 i = 0; i < proof.length; i++) {
```

## `++i` costs less gas compared to `i++` or `i += 1` (same for `--i` vs `i--` or `i -= 1`)

Pre-increments and pre-decrements are cheaper.

For a `uint256 i` variable, the following is true with the Optimizer enabled at 10k:

**Increment:**

- `i += 1` is the most expensive form
- `i++` costs 6 gas less than `i += 1`
- `++i` costs 5 gas less than `i++` (11 gas less than `i += 1`)

**Decrement:**

- `i -= 1` is the most expensive form
- `i--` costs 11 gas less than `i -= 1`
- `--i` costs 5 gas less than `i--` (16 gas less than `i -= 1`)

Note that post-increments (or post-decrements) return the old value before incrementing or decrementing, hence the name *post-increment*:

```solidity
uint i = 1;  
uint j = 2;
require(j == i++, "This will be false as i is incremented after the comparison");
```
  
However, pre-increments (or pre-decrements) return the new value:
  
```solidity
uint i = 1;  
uint j = 2;
require(j == ++i, "This will be true as i is incremented before the comparison");
```
  
In the pre-increment case, the compiler has to create a temporary variable (when used) for returning `1` instead of `2`.  
  
Affected code:  

```solidity
MerkleProof.sol:30:        for (uint256 i = 0; i < proof.length; i++) {
MerkleProof.sol:40:                index += 1;
```

Consider using pre-increments and pre-decrements where they are relevant (meaning: not where post-increments/decrements logic are relevant).

## Increments/decrements can be unchecked in for-loops

In Solidity 0.8+, there's a default overflow check on unsigned integers. It's possible to uncheck this in for-loops and save some gas at each iteration, but at the cost of some code readability, as this uncheck cannot be made inline.  
  
[ethereum/solidity#10695](https://github.com/ethereum/solidity/issues/10695)

Affected code:  

```solidity
MerkleProof.sol:30:        for (uint256 i = 0; i < proof.length; i++) {
```

The change would be:  
  
```diff
- for (uint256 i; i < numIterations; i++) {
+ for (uint256 i; i < numIterations;) {
 // ...  
+   unchecked { ++i; }
}  
```

The same can be applied with decrements (which should use `break` when `i == 0`).

The risk of overflow is non-existant for `uint256` here.

## No need to explicitly initialize variables with default values

If a variable is not set/initialized, it is assumed to have the default value (`0` for `uint`, `false` for `bool`, `address(0)` for address...). Explicitly initializing it with its default value is an anti-pattern and wastes gas.

As an example: `for (uint256 i = 0; i < numIterations; ++i) {` should be replaced with `for (uint256 i; i < numIterations; ++i) {`

Affected code:

```solidity
MerkleProof.sol:28:        uint256 index = 0;
MerkleProof.sol:30:        for (uint256 i = 0; i < proof.length; i++) {
```

I suggest removing explicit initializations for default values.

## Functions guaranteed to revert when called by normal users can be marked `payable`

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided.

```solidity
ClaimCODE.sol:62:    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
ClaimCODE.sol:68:    function sweep20(address _tokenAddr) external onlyOwner {
ClaimCODE.sol:75:    function sweep721(address _tokenAddr, uint256 _tokenID) external onlyOwner {
ClaimCODE.sol:81:    function pause() external onlyOwner {
ClaimCODE.sol:85:    function unpause() external onlyOwner {
CODE.sol:24:     function mint(address _to, uint256 _amount) external onlyRole(MINTER_ROLE) {
CODE.sol:28:     function sweep20(address _tokenAddr, address _to) external onlyRole(SWEEP_ROLE) {
CODE.sol:38:     ) external onlyRole(SWEEP_ROLE) {
```
