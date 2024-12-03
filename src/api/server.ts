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

// Example endpoint to fetch rewards for a specific user with total rewards
app.get('/api/rewards/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const { data, error } = await supabase
      .from('accrue_rewards_events')
      .select('*')
      .eq('user', user.toLowerCase())
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Sum up the amount in each reward event
    const totalAmount = data.reduce((acc: bigint, event: any) => {
      const amount = BigInt(event.allEventArgs.amount); // Convert amount to BigInt
      return acc + amount; // Add the amount to the accumulator
    }, BigInt(0)); // Start with 0 as the initial value for the accumulator

    res.json({
      user: user.toLowerCase(),
      totalRewards: totalAmount.toString(), // Convert BigInt to string to avoid precision issues in JSON
      events: data, // Return the original events data as well
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ error: 'Failed to fetch user rewards data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});