import { ethers, deployments } from "hardhat";

async function main() {
  const voterAddress = "0xDBC8813F9fEF6b24D14AbC9077D73f9668E47266";
  console.log("Adding voter address:", voterAddress);

  const Voting = await deployments.get("Voting");
  const voting = await ethers.getContractAt("Voting", Voting.address);

  const tx = await voting.addVoters([voterAddress], [true]);
  await tx.wait();

  console.log("✅ Added to allowlist!");

  const voterData = await voting.getVoterData(voterAddress);
  console.log("Is voter:", voterData[0]);
}

main().catch(console.error);
