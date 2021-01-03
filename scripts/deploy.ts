import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("FundraiserFactory");

  let contract = await factory.deploy();

  console.log(contract.address);

  console.log(contract.deployTransaction.hash);

  await contract.deployed();
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.log(error);
  process.exit(1);
});