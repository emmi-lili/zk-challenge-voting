import * as dotenv from "dotenv";
dotenv.config();
import { Wallet } from "ethers";
import password from "@inquirer/password";
import { spawn } from "child_process";
import { config } from "hardhat";

/**
 * Unencrypts the private key and runs any hardhat script
 * Usage: yarn ts-node scripts/runScriptWithPK.ts scripts/addVoter.ts --network sepolia
 */
async function main() {
  const scriptIndex = 2; // First arg after ts-node and this script
  const scriptPath = process.argv[scriptIndex];

  if (!scriptPath) {
    console.log("Usage: yarn ts-node scripts/runScriptWithPK.ts <script-path> --network <network>");
    return;
  }

  const networkIndex = process.argv.indexOf("--network");
  const networkName = networkIndex !== -1 ? process.argv[networkIndex + 1] : config.defaultNetwork;

  if (networkName === "localhost" || networkName === "hardhat") {
    const hardhat = spawn("hardhat", ["run", scriptPath, ...process.argv.slice(scriptIndex + 1)], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });

    hardhat.on("exit", code => {
      process.exit(code || 0);
    });
    return;
  }

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

  if (!encryptedKey) {
    console.log("🚫️ You don't have a deployer account. Run `yarn generate` or `yarn account:import` first");
    return;
  }

  const pass = await password({ message: "Enter password to decrypt private key:" });

  try {
    const wallet = await Wallet.fromEncryptedJson(encryptedKey, pass);
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY = wallet.privateKey;

    const hardhat = spawn("hardhat", ["run", scriptPath, ...process.argv.slice(scriptIndex + 1)], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });

    hardhat.on("exit", code => {
      process.exit(code || 0);
    });
  } catch {
    console.error("Failed to decrypt private key. Wrong password?");
    process.exit(1);
  }
}

main().catch(console.error);
