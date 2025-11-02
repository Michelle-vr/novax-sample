# NovaX Platform - Production Deployment Guide

This guide will help you deploy the NovaX platform to production with all necessary configurations.

## Prerequisites

Before deploying to production, ensure you have:

1. **WalletConnect Project ID**
   - Sign up at [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy your Project ID

2. **Etherscan API Key** (for transaction history)
   - Sign up at [Etherscan](https://etherscan.io/apis)
   - Generate an API key

3. **CoinGecko API Key** (optional, for higher rate limits)
   - Sign up at [CoinGecko API](https://www.coingecko.com/en/api)

## Configuration Steps

### 1. Update Web3 Configuration

Edit `src/config/web3.ts`:

```typescript
export const projectId = '21d5a39f07db730559f038a36cdf4789' // Replace with your actual Project ID
```

### 2. Update Smart Contract Addresses (if using custom contracts)

Edit `src/contracts/DEXContract.ts`:

```typescript
// Replace with your deployed contract addresses
export const DEX_CONTRACT_ADDRESS = '0xYourDEXContractAddress'
export const FARM_CONTRACT_ADDRESS = '0xYourFarmContractAddress'
```

### 3. Update API Keys

Create a `.env.production` file:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
VITE_COINGECKO_API_KEY=your_coingecko_api_key (optional)
```

Then update `src/components/TransactionHistory.tsx`:

```typescript
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || 'YourApiKeyToken'
```

### 4. Update Chain Configuration

Edit `src/config/web3.ts` to use mainnet:

```typescript
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism], // Add chains you want to support
  // ... rest of config
})
```

## Build for Production

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Preview production build locally
bun run preview
```

## Deploy to Netlify

### Option 1: Auto Deploy (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Option 2: Manual Deploy

```bash
# Build the project
bun run build

# Install Netlify CLI
bun add -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Deploy to Vercel

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel --prod
```

## Post-Deployment Checklist

- [ ] Verify WalletConnect is working (try connecting wallets)
- [ ] Test token swaps on testnet first
- [ ] Verify transaction history is loading
- [ ] Check price charts are updating
- [ ] Test liquidity pool management
- [ ] Verify notifications are working
- [ ] Test user authentication
- [ ] Check mobile responsiveness
- [ ] Test all language translations
- [ ] Verify social media links
- [ ] Test admin dashboard access
- [ ] Monitor error logs

## Security Considerations

### Smart Contract Integration
- **Always test on testnet first** (Sepolia, Goerli)
- Audit your smart contracts before mainnet deployment
- Use proper slippage protection
- Implement rate limiting for API calls

### User Data
- User profiles are stored in localStorage (client-side only)
- For production, consider implementing a backend API
- Encrypt sensitive user data
- Implement proper authentication backend

### API Keys
- Never commit API keys to git
- Use environment variables
- Rotate keys regularly
- Monitor API usage

## Performance Optimization

### 1. Enable Caching
Add to `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Optimize Images
- Use WebP format for images
- Compress all assets
- Implement lazy loading

### 3. Code Splitting
Already configured with Vite - verify bundle sizes:

```bash
bun run build -- --analyze
```

## Monitoring

### Error Tracking
Integrate error tracking:

```bash
bun add @sentry/react @sentry/vite-plugin
```

### Analytics
Add analytics to track usage:

```bash
bun add @vercel/analytics
# or
bun add react-ga4
```

## Maintenance

### Regular Updates
```bash
# Update dependencies
bun update

# Check for vulnerabilities
bun audit

# Update wagmi and viem
bun add wagmi@latest viem@latest
```

### Backup Strategy
- Backup contract addresses
- Export user data regularly
- Monitor blockchain events
- Keep deployment logs

## Troubleshooting

### WalletConnect Not Working
- Verify Project ID is correct
- Check network connectivity
- Ensure correct chain IDs

### Transactions Failing
- Check gas prices
- Verify contract addresses
- Test on testnet first
- Check slippage settings

### Price Data Not Loading
- Verify CoinGecko API is accessible
- Check WebSocket connections
- Monitor rate limits
- Implement fallback mechanisms

## Support

For issues or questions:
- Email: support@novax.meme
- Discord: [Join our community]
- Twitter: [@NovaXDeFi]

## License

Copyright © 2025 NovaX Platform
Owned by BOB Information Service Limited.
