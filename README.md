# Rewards Indexer 🏆

A specialized indexing service built with Ponder to track and monitor reward events across Mode and Base networks. This service captures `ClaimRewards` events and stores them in a Supabase database for easy querying and analysis.

## 🌟 Features

- Real-time indexing of blockchain events
- Multi-chain support (Mode & Base networks)
- REST API for querying reward data
- Supabase integration for reliable data storage
- BigInt handling for precise reward calculations
- Comprehensive error handling and logging

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.14
- npm
- Supabase account and credentials

### Environment Setup

Create a `.env` file in the root directory:

### Environment Variables

The following environment variables are required:

* `SUPABASE_URL`: Your Supabase URL
* `SUPABASE_KEY`: Your Supabase key
* `PORT`: The port number (optional, defaults to 3000)


### Installation

To install the dependencies, run the following command in your terminal:
```bash
npm install
```

## Running the Service

You have multiple options to run the service:

- Run both the indexer and API server concurrently
```bash
npm run dev
```
- Run only the API server
```bash
npm run start-api
```
- Run only the Ponder indexer
```bash
npm run ponder
```

## 🏗 Project Structure

The indexer directory has the following structure:

* `src/`: This directory contains the main indexer logic.
	+ `index.ts`: This file contains the main indexer logic.
	+ `api/`: This directory contains the API setup.
		- `index.ts`: This file contains the GraphQL setup.
		- `server.ts`: This file contains the REST API endpoints.
* `abis/`: This directory contains the contract ABI definitions.
	+ `ExampleContractAbi.ts`: This file contains the contract ABI definitions.
* `ponder.config.ts`: This file contains the Ponder configuration.
* `ponder.schema.ts`: This file contains the database schema definitions.

## 🚀 API Endpoints

### Retrieve User Rewards

**HTTP Method:** `GET`
**Endpoint:** `/api/rewards/:user`

This endpoint fetches and returns the reward events and the total rewards accumulated for a specific user address.

#### Response Example

json
{
  "user": "0x123...",
  "totalRewards": "1000000000000000000",
  "events": [
    {
      "event_type": "ClaimRewards",
      "chain": "mode",
      "timestamp": "1234567890",
      "allEventArgs": {
        "amount": "1000000000000000000"
      },
      // ... other event data
    }
  ]
}


## 🔍 Supported Events

- `FlywheelCore:ClaimRewards` (Mode Network)
- `FlywheelCoreBase:ClaimRewards` (Base Network)

## 🛠 Development

### Adding New Networks

To add support for a new network, update `ponder.config.ts`:

```typescript
networks: {
  newNetwork: {
    chainId: YOUR_CHAIN_ID,
    transport: http("YOUR_RPC_URL"),
  },
  // ... existing networks
}
```


### Adding New Contracts

To add new contract configurations, update `ponder.config.ts` with the following structure:

```typescript
contracts: {
  NewContract: {
    network: "networkName",
    abi: ContractABI,
    address: "CONTRACT_ADDRESS",
    startBlock: START_BLOCK_NUMBER,
  },
  // ... existing contracts
}

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Note

Make sure to handle your environment variables securely and never commit them to version control.