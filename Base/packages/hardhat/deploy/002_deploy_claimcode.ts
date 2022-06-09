import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  // the treasury account is the DAO multi-sig wallet in production
  const { deployer, treasury } = await getNamedAccounts();

  const claimEndDate = new Date();
  // claim period expired in 90 days
  const claimEnd = Math.floor(claimEndDate.setDate(new Date().getDate() + 90) / 1000);
  console.log('claimEnd', claimEnd);

  const codeContract = await ethers.getContract('CODE');
  const connectContract = await codeContract.connect(await ethers.getSigner(deployer));
  const devAmount = await codeContract.balanceOf(deployer);
  console.log('devAmount:', devAmount.toString());

  const dd = await deploy('ClaimCODE', {
    from: deployer,
    log: true,
    args: [claimEnd, codeContract.address],
  });

  await connectContract.transfer(treasury, ethers.utils.parseUnits((6_500_000).toString(), 18));
  await connectContract.transfer(dd.address, ethers.utils.parseUnits((3_500_000).toString(), 18));

  const claimContract = await ethers.getContract('ClaimCODE');
  const connectClaimContract = await claimContract.connect(await ethers.getSigner(deployer));

  await connectClaimContract.transferOwnership(treasury);

  console.log('treasuryAmount:', (await codeContract.balanceOf(treasury)).toString());
  console.log('airdropAmount:', (await codeContract.balanceOf(dd.address)).toString());

  console.log('ClaimCODE contract deployer:', deployer);
  console.log('ClaimCODE contract deployed to:', dd.address);
};

export default main;
main.dependencies = ['CODE'];
main.tags = ['ClaimCODE'];
