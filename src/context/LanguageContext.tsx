import type React from 'react'
import { createContext, useContext, useState, type ReactNode } from 'react'

type Language = 'en' | 'zh'

interface Translations {
  en: Record<string, string>
  zh: Record<string, string>
}

const translations: Translations = {
  en: {
    // Header
    'nav.dex': 'DEX',
    'nav.launchpad': 'Launchpad',
    'nav.farm': 'Farm',
    'nav.portfolio': 'Portfolio',
    'nav.connect': 'Connect',
    'nav.connected': 'Connected',

    // Hero
    'hero.title': 'NovaX',
    'hero.subtitle': 'The Future of Decentralized Finance',
    'hero.description': 'Trade, launch, and invest in the next generation of blockchain projects with NovaX\'s comprehensive DeFi platform',
    'hero.connectWallet': 'Connect Wallet',
    'hero.walletConnected': 'Wallet Connected',
    'hero.exploreDex': 'Explore DEX',
    'hero.whitebook': 'WhiteBook',

    // Stats
    'stats.totalVolume': 'Total Volume',
    'stats.activeUsers': 'Active Users',
    'stats.projectsLaunched': 'Projects Launched',
    'stats.tvl': 'TVL',

    // Features
    'feature.dex.title': 'DEX Trading',
    'feature.dex.description': 'Decentralized exchange with lightning-fast swaps and deep liquidity',
    'feature.launchpad.title': 'Launchpad',
    'feature.launchpad.description': 'Launch and invest in vetted blockchain projects with confidence',
    'feature.portfolio.title': 'Portfolio',
    'feature.portfolio.description': 'Track your assets and performance across all NovaX features',
    'feature.farm.title': 'Farm',
    'feature.farm.description': 'Stake your tokens and earn rewards through liquidity farming',
    'feature.quantization.title': 'Quantization',
    'feature.quantization.description': 'Advanced trading algorithms and automated strategies',
    'feature.explore': 'Explore',

    // Security
    'security.title': 'Secured by Innovation',
    'security.description': 'NovaX is built with cutting-edge security protocols and audited smart contracts',
    'security.audited': 'Audited Contracts',
    'security.instant': 'Instant Swaps',
    'security.vetted': 'Vetted Projects',
    'security.realtime': 'Real-time Data',

    // Footer
    'footer.platform': 'NovaX Platform',
    'footer.whitebook': 'WhiteBook',
    'footer.copyright': '© 2025 NovaX.meme',
    'footer.ownership': 'Nova X.meme is owned by BOB Information Service Limited.',

    // Mobile Menu
    'menu.social': 'Social Media',
    'menu.telegram': 'Telegram',
    'menu.twitter': 'Twitter',
    'menu.discord': 'Discord',
    'menu.close': 'Close Menu'
  },
  zh: {
    // Header
    'nav.dex': 'DEX交易',
    'nav.launchpad': '发射台',
    'nav.farm': '农场',
    'nav.portfolio': '投资组合',
    'nav.connect': '连接',
    'nav.connected': '已连接',

    // Hero
    'hero.title': 'NovaX',
    'hero.subtitle': '去中心化金融的未来',
    'hero.description': '通过NovaX综合DeFi平台交易、发射和投资下一代区块链项目',
    'hero.connectWallet': '连接钱包',
    'hero.walletConnected': '钱包已连接',
    'hero.exploreDex': '探索DEX',
    'hero.whitebook': '白皮书',

    // Stats
    'stats.totalVolume': '总交易量',
    'stats.activeUsers': '活跃用户',
    'stats.projectsLaunched': '已发射项目',
    'stats.tvl': '总锁仓量',

    // Features
    'feature.dex.title': 'DEX交易',
    'feature.dex.description': '闪电般快速的去中心化交易所，拥有深度流动性',
    'feature.launchpad.title': '发射台',
    'feature.launchpad.description': '自信地发射和投资经过审核的区块链项目',
    'feature.portfolio.title': '投资组合',
    'feature.portfolio.description': '跟踪您在所有NovaX功能中的资产和表现',
    'feature.farm.title': '流动性挖矿',
    'feature.farm.description': '质押您的代币，通过流动性挖矿赚取奖励',
    'feature.quantization.title': '量化交易',
    'feature.quantization.description': '高级交易算法和自动化策略',
    'feature.explore': '探索',

    // Security
    'security.title': '创新保障安全',
    'security.description': 'NovaX采用尖端安全协议和经过审计的智能合约构建',
    'security.audited': '已审计合约',
    'security.instant': '即时交换',
    'security.vetted': '审核项目',
    'security.realtime': '实时数据',

    // Footer
    'footer.platform': 'NovaX 平台',
    'footer.whitebook': '白皮书',
    'footer.copyright': '© 2025 NovaX.meme',
    'footer.ownership': 'Nova X.meme 由 BOB Information Service Limited 拥有。',

    // Mobile Menu
    'menu.social': '社交媒体',
    'menu.telegram': 'Telegram',
    'menu.twitter': 'Twitter',
    'menu.discord': 'Discord',
    'menu.close': '关闭菜单'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
