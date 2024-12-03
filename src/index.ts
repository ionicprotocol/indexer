import { ponder } from "@/generated";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

// Supabase Client Initialization
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

// Utility to sanitize BigInt fields
const sanitizeBigIntFields = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    acc[key] =
      typeof value === "bigint" ? value.toString() :
      typeof value === "object" ? sanitizeBigIntFields(value) :
      value;
    return acc;
  }, {} as any);
};

// Store event in Supabase
const storeEventInSupabase = async (eventData: EventData, eventType: string, chain: string) => {
    try {
      const eventDataSanitized = {
        ...eventData,
        timestamp: eventData.timestamp.toString(),
        blockNumber: eventData.blockNumber.toString(),
        allEventArgs: sanitizeBigIntFields(eventData.allEventArgs),
      };
  
      console.log('Attempting to insert with chain:', chain);
      console.log('Full insert data:', {
        event_type: eventType,
        chain: chain,
        ...eventDataSanitized,
      });
  
      const { data, error } = await supabase
        .from("accrue_rewards_events")
        .insert([
          {
            event_type: eventType,
            chain: chain,
            ...eventDataSanitized,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting event into Supabase:", error);
        throw error;
      }
      console.log("Inserted data:", data);
    } catch (e) {
      console.error("Unexpected error during Supabase insertion:", e);
      throw e;
    }
  };

// EventData Type Definition
type EventData = {
  user: string;
  timestamp: bigint;
  transactionHash: string;
  blockNumber: bigint;
  logIndex: number;
  allEventArgs: Record<string, any>;
};

// Event Handlers
// ponder.on("FlywheelCore:AccrueRewards", async ({ event }: { event: any }) => {
//     const eventData: EventData = {
//     //   id: uuidv4(),  // Generate a new UUID for each event
//       user: event.args.user.toLowerCase(),
//       timestamp: BigInt(event.block.timestamp),
//       transactionHash: event.transaction.hash,
//       blockNumber: BigInt(event.block.number),
//       logIndex: event.log.logIndex,
//       allEventArgs: event.args,
//     };

//   console.log("FlywheelCore:AccrueRewards Event Received:", eventData);

//   try {
//     await storeEventInSupabase(eventData, "AccrueRewards");
//     console.log("Event processed and stored successfully");
//   } catch (error) {
//     console.error("Error processing AccrueRewards event:", error);
//   }
// });

ponder.on("FlywheelCore:ClaimRewards", async ({ event, context }: { event: any, context: any }) => {
  const networkName = context.network.name || 'unknown';
  console.log("Mode Network Event Detected:", networkName);
  
  const eventData: EventData = {
    user: event.args.user.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    allEventArgs: sanitizeBigIntFields(event.args),
  };

  const safeEventObject = sanitizeBigIntFields(event);
  console.log("Complete event object:", safeEventObject);

  console.log("FlywheelCore:ClaimRewards Event Received:", eventData);

  try {
    console.log("Storing event with chain:", networkName);
    await storeEventInSupabase(eventData, "ClaimRewards", networkName);
    console.log("Event processed and stored successfully");
  } catch (error) {
    console.error("Error processing ClaimRewards event:", error);
  }
});

ponder.on("FlywheelCoreBase:ClaimRewards", async ({ event, context }: { event: any, context: any }) => {
  const networkName = context.network.name || 'unknown';
  console.log("Base Network Event Detected:", networkName);
  
  const eventData: EventData = {
    user: event.args.user.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    transactionHash: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    logIndex: event.log.logIndex,
    allEventArgs: sanitizeBigIntFields(event.args),
  };

  try {
    console.log("Storing Base event with chain:", networkName);
    await storeEventInSupabase(eventData, "ClaimRewards", networkName);
    console.log("Base event processed and stored successfully");
  } catch (error) {
    console.error("Error processing Base ClaimRewards event:", error);
  }
});
