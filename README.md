# NovaX DeFi Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

**NovaX** - The Future of Decentralized Finance

A comprehensive DeFi platform featuring DEX trading, launchpad, yield farming, and portfolio management with an integrated AI assistant.

## 🌟 Features

- **🔄 DEX Trading** - Lightning-fast token swaps with deep liquidity
- **🚀 Launchpad** - Launch and invest in vetted blockchain projects
- **🌾 Farm** - Stake tokens and earn rewards through liquidity farming
- **📊 Portfolio** - Track your assets and performance across all features
- **📈 Quantization** - Advanced trading algorithms and automated strategies
- **💬 AI Assistant** - Integrated Gemini AI for development assistance
- **🔗 Web3 Integration** - MetaMask, WalletConnect, and Coinbase Wallet support
- **🌍 Multi-language** - English and Chinese support

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A Web3 wallet (MetaMask, WalletConnect compatible wallet)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/novax-platform.git
cd novax-platform/gemini-ai-app

# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:5173` to see the app.

## ⚙️ WalletConnect Configuration

To enable wallet connection functionality, you need to configure WalletConnect:

### 1. Get Your Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up for a free account
3. Create a new project
4. Copy your **Project ID**

### 2. Update Configuration

Edit `src/config/web3.ts` and replace the placeholder:

```typescript
const projectId = 'YOUR_ACTUAL_PROJECT_ID_HERE'
```

### 3. Supported Networks

The platform supports the following networks by default:
- Ethereum Mainnet (Chain ID: 1)
- Sepolia Testnet (Chain ID: 11155111)
- Binance Smart Chain (Chain ID: 56)
- Polygon (Chain ID: 137)

To add more networks, edit `src/config/web3.ts`:

```typescript
import { arbitrum, optimism } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, polygon, arbitrum, optimism],
  // ... rest of config
})
```

## 🎨 Customization

### Theme Colors

The platform uses a platinum-black theme with golden accents. To customize:

- Edit `tailwind.config.js` for color scheme
- Modify `src/index.css` for global styles

### Language Support

To add a new language:

1. Edit `src/context/LanguageContext.tsx`
2. Add translations to the `translations` object:

```typescript
const translations = {
  en: { /* English */ },
  zh: { /* Chinese */ },
  es: { /* Add Spanish */ }
}
```

## 📦 Build for Production

```bash
# Build the project
bun run build

# Preview production build
bun run preview
```

## 🚀 Deployment

The project is configured for Netlify deployment:

```bash
# Deploy to Netlify
netlify deploy --prod
```

Or connect your GitHub repository to Netlify for automatic deployments.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini AI API Key (required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key

# WalletConnect Project ID (required for wallet connection)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional: Custom RPC endpoints
VITE_ETHEREUM_RPC=https://your-ethereum-rpc
VITE_BSC_RPC=https://your-bsc-rpc
```

## 📚 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Web3**: Wagmi + Viem + WalletConnect
- **State Management**: React Context API
- **Animations**: Framer Motion
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React

## 🏗️ Project Structure

```
gemini-ai-app/
├── public/              # Static assets
│   └── novax-logo.svg  # NovaX logo
├── src/
│   ├── components/      # React components
│   │   ├── NovaXPlatform.tsx
│   │   ├── Portfolio.tsx
│   │   ├── DEXInterface.tsx
│   │   └── ...
│   ├── config/          # Configuration files
│   │   └── web3.ts      # Web3 configuration
│   ├── context/         # React contexts
│   │   ├── AppContext.tsx
│   │   └── LanguageContext.tsx
│   ├── services/        # API services
│   │   └── gemini.ts
│   └── utils/           # Utility functions
├── package.json
└── README.md
```

## 🔐 Security

- All smart contract interactions should be audited
- Never commit private keys or sensitive data
- Use environment variables for API keys
- Enable 2FA on your WalletConnect Cloud account

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Website**: https://NovaX.meme
- **Documentation**: https://docs.novax.meme
- **Telegram**: https://t.me/novaxmeme
- **Twitter**: https://x.com/Novax_meme
- **Discord**: https://discord.gg/gqzC8aHWjz

## 👨‍💻 Developed By

**BOB Information Service Limited**

© 2025 NovaX.meme - All rights reserved

## 🙏 Acknowledgments

- WalletConnect for Web3 connectivity
- Google Gemini for AI capabilities
- Shadcn UI for beautiful components
- The Ethereum and DeFi community

---

**Need help?** Join our [Discord](https://discord.gg/gqzC8aHWjz) community!
