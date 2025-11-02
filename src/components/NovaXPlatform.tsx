import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Rocket,
  Wallet,
  BarChart3,
  Coins,
  ArrowUpDown,
  Zap,
  Shield,
  Users,
  DollarSign,
  ChevronRight,
  Star,
  Activity,
  MessageCircle,
  Send,
  FileText,
  Sprout,
  LineChart,
  Menu,
  Globe
} from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import NovaXLogo from './NovaXLogo'
import ParticleBackground from './ParticleBackground'
import DEXInterface from './DEXInterface'
import LaunchpadInterface from './LaunchpadInterface'
import MobileMenu from './MobileMenu'
import PortfolioPage from './PortfolioPage'
import FarmInterface from './FarmInterface'
import AdminDashboard from './AdminDashboard'
import UserProfile from './UserProfile'
import { useLanguage } from '../context/LanguageContext'
import { User } from 'lucide-react'

type PlatformView = 'home' | 'dex' | 'launchpad' | 'portfolio' | 'farm' | 'quantization' | 'admin' | 'profile'

const NovaXPlatform: React.FC = () => {
  const [currentView, setCurrentView] = useState<PlatformView>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  const { language, setLanguage, t } = useLanguage()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const features = [
    {
      icon: ArrowUpDown,
      titleKey: 'feature.dex.title',
      descriptionKey: 'feature.dex.description',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => window.open('https://dex.novax.meme', '_blank')
    },
    {
      icon: Rocket,
      titleKey: 'feature.launchpad.title',
      descriptionKey: 'feature.launchpad.description',
      gradient: 'from-purple-500 to-pink-500',
      action: () => window.open('https://launch.novax.meme', '_blank')
    },
    {
      icon: BarChart3,
      titleKey: 'feature.portfolio.title',
      descriptionKey: 'feature.portfolio.description',
      gradient: 'from-green-500 to-emerald-500',
      action: () => setCurrentView('portfolio')
    },
    {
      icon: Sprout,
      titleKey: 'feature.farm.title',
      descriptionKey: 'feature.farm.description',
      gradient: 'from-green-600 to-lime-500',
      action: () => setCurrentView('farm')
    },
    {
      icon: LineChart,
      titleKey: 'feature.quantization.title',
      descriptionKey: 'feature.quantization.description',
      gradient: 'from-violet-500 to-purple-600',
      action: () => window.open('https://launch.novax.meme', '_blank')
    }
  ]

  const stats = [
    { labelKey: 'stats.totalVolume', value: '$2.8B', icon: DollarSign },
    { labelKey: 'stats.activeUsers', value: '450K+', icon: Users },
    { labelKey: 'stats.projectsLaunched', value: '127', icon: Rocket },
    { labelKey: 'stats.tvl', value: '$890M', icon: Shield }
  ]

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect()
    } else {
      // Connect with the first available connector (MetaMask)
      const injectedConnector = connectors.find(c => c.id === 'injected')
      if (injectedConnector) {
        connect({ connector: injectedConnector })
      }
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dex':
        return <DEXInterface onBack={() => setCurrentView('home')} />
      case 'launchpad':
        return <LaunchpadInterface onBack={() => setCurrentView('home')} />
      case 'portfolio':
        return <PortfolioPage onBack={() => setCurrentView('home')} />
      case 'farm':
        return <FarmInterface onBack={() => setCurrentView('home')} />
      case 'admin':
        return <AdminDashboard onBack={() => setCurrentView('home')} />
      case 'profile':
        return <UserProfile onClose={() => setCurrentView('home')} />
      default:
        return (
          <>
            {/* Hero Section */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <NovaXLogo size={140} animate={true} />

              <motion.h1
                className="text-6xl font-black mt-8 mb-4 bg-gradient-to-r from-yellow-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.3))',
                  textShadow: '0 0 60px rgba(255,215,0,0.2)'
                }}
              >
                {t('hero.title')}
              </motion.h1>

              <motion.p
                className="text-2xl text-amber-200/80 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.p
                className="text-zinc-400 max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t('hero.description')}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={handleConnectWallet}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                    isConnected
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500'
                  }`}
                  style={{
                    boxShadow: '0 10px 40px rgba(255,215,0,0.3)'
                  }}
                >
                  <Wallet size={20} />
                  {isConnected
                    ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t('hero.walletConnected'))
                    : t('hero.connectWallet')
                  }
                </button>

                <a
                  href="https://dex.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-lg transition-all duration-300 border border-yellow-500/30 inline-block"
                >
                  {t('hero.exploreDex')}
                </a>

                <a
                  href="https://docs.novax.meme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl font-bold text-lg transition-all duration-300 border border-zinc-700 flex items-center gap-2"
                >
                  <FileText size={20} />
                  {t('hero.whitebook')}
                </a>
              </motion.div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.labelKey}
                  className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-md text-center"
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-400">{t(stat.labelKey)}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Features */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  className="group relative bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-8 backdrop-blur-md cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.03, y: -8 }}
                  onClick={feature.action}
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} bg-opacity-20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={32} className="text-yellow-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-amber-100 mb-3">{t(feature.titleKey)}</h3>
                    <p className="text-amber-200/70 mb-4 leading-relaxed">{t(feature.descriptionKey)}</p>

                    <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                      <span className="text-sm font-medium">{t('feature.explore')}</span>
                      <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Security & Trust */}
            <motion.div
              className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-8 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <div className="text-center mb-8">
                <Shield size={48} className="mx-auto mb-4 text-yellow-400" />
                <h2 className="text-3xl font-bold text-amber-100 mb-2">{t('security.title')}</h2>
                <p className="text-amber-200/70 max-w-2xl mx-auto">
                  {t('security.description')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Shield, labelKey: 'security.audited' },
                  { icon: Zap, labelKey: 'security.instant' },
                  { icon: Star, labelKey: 'security.vetted' },
                  { icon: Activity, labelKey: 'security.realtime' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <item.icon size={24} className="text-yellow-400" />
                    </div>
                    <div className="text-sm text-zinc-300">{t(item.labelKey)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white overflow-hidden relative">
      <ParticleBackground density={80} />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.06),transparent_50%)]" />

      {/* Header */}
      <header className="relative z-20 border-b border-yellow-500/20 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <NovaXLogo size={50} animate={false} />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
                NovaX
              </span>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a
                  href="https://dex.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                  {t('nav.dex')}
                </a>
                <a
                  href="https://launch.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                  {t('nav.launchpad')}
                </a>
                <a
                  href="https://farm.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-400 hover:text-yellow-400 transition-colors"
                >
                  {t('nav.farm')}
                </a>
                <button
                  onClick={() => setCurrentView('portfolio')}
                  className={`font-medium transition-colors ${
                    currentView === 'portfolio' ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t('nav.portfolio')}
                </button>
              </nav>

              {/* Social Media Icons */}
              <div className="hidden lg:flex items-center gap-3 border-l border-yellow-500/20 pl-4">
                <a
                  href="https://t.me/novaxmeme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-blue-500/20 border border-zinc-700 hover:border-blue-500/50 flex items-center justify-center text-zinc-400 hover:text-blue-400 transition-all group"
                  title="Telegram"
                >
                  <Send size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://x.com/Novax_meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-sky-500/20 border border-zinc-700 hover:border-sky-500/50 flex items-center justify-center text-zinc-400 hover:text-sky-400 transition-all group"
                  title="Twitter/X"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://discord.gg/gqzC8aHWjz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-indigo-500/20 border border-zinc-700 hover:border-indigo-500/50 flex items-center justify-center text-zinc-400 hover:text-indigo-400 transition-all group"
                  title="Discord"
                >
                  <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://docs.novax.meme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-yellow-500/20 border border-zinc-700 hover:border-yellow-500/50 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all group"
                  title="WhiteBook"
                >
                  <FileText size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Globe size={20} className="text-zinc-400" />
                  <span className="text-sm text-zinc-400 hidden sm:inline">{language.toUpperCase()}</span>
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-zinc-900 border border-yellow-500/20 rounded-lg shadow-xl py-2 min-w-[120px] z-50">
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors ${
                        language === 'en' ? 'text-yellow-400' : 'text-zinc-400'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('zh')
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors ${
                        language === 'zh' ? 'text-yellow-400' : 'text-zinc-400'
                      }`}
                    >
                      中文
                    </button>
                  </div>
                )}
              </div>

              {/* User Profile Button */}
              {isConnected && (
                <button
                  onClick={() => setCurrentView('profile')}
                  className="hidden md:flex p-2.5 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Profile"
                >
                  <User size={20} className="text-yellow-400" />
                </button>
              )}

              <button
                onClick={handleConnectWallet}
                className={`hidden md:flex px-6 py-2.5 rounded-lg font-medium transition-all items-center gap-2 ${
                  isConnected
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black'
                }`}
              >
                <Wallet size={18} />
                {isConnected ? t('nav.connected') : t('nav.connect')}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onPortfolioClick={() => setCurrentView('portfolio')}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-yellow-500/20 bg-black/40 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-2 text-amber-200/50">
                <NovaXLogo size={30} animate={false} />
                <span className="font-medium">{t('footer.platform')}</span>
                <span>•</span>
                <span className="text-sm">v1.0.0</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
                <a
                  href="https://docs.novax.meme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                >
                  <FileText size={16} />
                  <span>{t('footer.whitebook')}</span>
                </a>
                <a
                  href="https://dex.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t('nav.dex')}
                </a>
                <a
                  href="https://farm.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t('nav.farm')}
                </a>
                <a
                  href="https://launch.novax.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t('nav.launchpad')}
                </a>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                >
                  <Shield size={16} />
                  <span>Admin</span>
                </button>
              </div>

              <div className="text-sm text-zinc-500">
                {t('footer.copyright')}
              </div>
            </div>

            {/* Ownership Statement */}
            <div className="text-center text-xs text-zinc-500 border-t border-yellow-500/10 pt-4">
              {t('footer.ownership')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default NovaXPlatform
