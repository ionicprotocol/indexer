import { createConfig } from "@ponder/core";
import { http } from "viem";  // Import the HTTP transport function
// Import the ABI
import { ExampleContractAbi } from './abis/ExampleContractAbi';

// Now you can interact with the contract
export default createConfig({
  networks: {
    mode: {
      chainId: 34443,
      transport: http("https://rpc-mode-mainnet-0.t.conduit.xyz/EMwmaWPeudW9TUkLcxpYEkzeSSMtbPn4X"),
    },
    base: {
      chainId: 8453,
      transport: http("https://base.meowrpc.com"),
    },
  },
  contracts: {
    FlywheelCore: {
      network: "mode",
      abi: ExampleContractAbi, // Make sure the ABI is correctly imported
      address: "0xcC11Fc7048db155F691Cc20Ac9958Fc465fa0062",
      startBlock: 14540729,
    },
    FlywheelCoreBase: {
      network: "base",
      abi: ExampleContractAbi,
      address: "0x6e93f617AB6CEfFec7c276B4fD4c136B7A7aDD54",
      startBlock: 18457818,
    },
  },
});