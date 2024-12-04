import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL! || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY! || ""
const supabase = createClient(supabaseUrl, supabaseKey);


app.use(express.json());

// Updated endpoint to include chain parameter
app.get('/api/rewards/:chain/:user', async (req : any , res : any) => {
  try {
    const { chain, user } = req.params;
    const validChains = ['mode', 'base']; // Add supported chains here

    // Hardcoded ionTokenAddress for each chain
    const ionTokenAddresses: { [key: string]: string } = {
      mode: '0x18470019bF0E94611f15852F7e93cf5D65BC34CA', // Replace with actual address
      base: '0x3eE5e23eEE121094f1cFc0Ccc79d6C809Ebd22e5', // Replace with actual address
    };

    // Validate chain parameter
    if (!validChains.includes(chain.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid chain. Supported chains are: ' + validChains.join(', ') });
    }

    const { data, error } = await supabase
      .from('accrue_rewards_events')
      .select('*')
      .eq('user', user.toLowerCase())
      .eq('chain', chain.toLowerCase()) // Add chain filter
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Create a Map to track unique events using transactionHash as the key
    const uniqueEvents = new Map();
    data.forEach((event: any) => {
      const eventKey = event.transactionHash; // Or use: `${event.blockNumber}-${event.logIndex}`
      if (!uniqueEvents.has(eventKey)) {
        uniqueEvents.set(eventKey, event);
      }
    });

    // Sum up the amount only for unique events
    const totalAmount = Array.from(uniqueEvents.values()).reduce((acc: bigint, event: any) => {
      const amount = BigInt(event.allEventArgs.amount);
      return acc + amount;
    }, BigInt(0));

    res.json({
      chain: chain.toLowerCase(),
      user: user.toLowerCase(),
      totalRewards: totalAmount.toString(),
      ionTokenAddress: ionTokenAddresses[chain.toLowerCase()], // Include ionTokenAddress in response
      // uniqueEventsCount: uniqueEvents.size,
      // totalEventsCount: data.length,
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ error: 'Failed to fetch user rewards data' });
  }
});

// Add health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});