import { ethers, deployments } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  console.log("Adding deployer address:", signerAddress);

  const Voting = await deployments.get("Voting");
  const voting = await ethers.getContractAt("Voting", Voting.address);

  const tx = await voting.addVoters([signerAddress], [true]);
  await tx.wait();

  console.log("✅ Added to allowlist!");

  const voterData = await voting.getVoterData(signerAddress);
  console.log("Is voter:", voterData[0]);
}

main().catch(console.error);
