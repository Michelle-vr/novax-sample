import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, bsc, polygon } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect项目ID - 您需要在 https://cloud.walletconnect.com 获取
const projectId = 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, polygon],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: 'NovaX' })
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http()
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
