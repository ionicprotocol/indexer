import { onchainTable } from "@ponder/core";

// Define the schema for the "reward_accrued" table
export const rewardAccrued = onchainTable("reward_accrued", (p) => ({
  id: p.text().primaryKey(),
  strategy: p.hex().notNull(),
  user: p.hex().notNull(),
  reward: p.bigint().notNull(),
  timestamp: p.integer().notNull(),
}));
