import type React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu, Send, MessageCircle, FileText, Wallet } from 'lucide-react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useLanguage } from '../context/LanguageContext'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onPortfolioClick?: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onPortfolioClick }) => {
  const { t } = useLanguage()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect()
    } else {
      const injectedConnector = connectors.find(c => c.id === 'injected')
      if (injectedConnector) {
        connect({ connector: injectedConnector })
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-gradient-to-br from-zinc-900 to-black border-l border-yellow-500/20 z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-yellow-500/20">
              <h2 className="text-xl font-bold text-yellow-400">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={24} className="text-zinc-400" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Navigation</h3>
              <a
                href="https://dex.novax.meme"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-white font-medium transition-colors"
              >
                {t('nav.dex')}
              </a>
              <a
                href="https://launch.novax.meme"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-white font-medium transition-colors"
              >
                {t('nav.launchpad')}
              </a>
              <a
                href="https://farm.novax.meme"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-white font-medium transition-colors"
              >
                {t('nav.farm')}
              </a>
              <button
                onClick={() => {
                  if (onPortfolioClick) onPortfolioClick()
                  onClose()
                }}
                className="block w-full text-left px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-white font-medium transition-colors"
              >
                {t('nav.portfolio')}
              </button>
            </div>

            {/* Wallet Management */}
            <div className="p-6 border-t border-yellow-500/10">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4">Wallet</h3>
              {isConnected ? (
                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-sm text-zinc-400 mb-1">Connected</div>
                    <code className="text-green-400 text-sm">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </code>
                  </div>
                  <button
                    onClick={handleConnectWallet}
                    className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Wallet size={20} />
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Social Media */}
            <div className="p-6 border-t border-yellow-500/10">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4">{t('menu.social')}</h3>
              <div className="space-y-3">
                <a
                  href="https://t.me/novaxmeme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all"
                >
                  <Send size={20} />
                  <span className="font-medium">{t('menu.telegram')}</span>
                </a>
                <a
                  href="https://x.com/Novax_meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg text-sky-400 hover:text-sky-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="font-medium">{t('menu.twitter')}</span>
                </a>
                <a
                  href="https://discord.gg/gqzC8aHWjz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:text-indigo-300 transition-all"
                >
                  <MessageCircle size={20} />
                  <span className="font-medium">{t('menu.discord')}</span>
                </a>
                <a
                  href="https://docs.novax.meme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all"
                >
                  <FileText size={20} />
                  <span className="font-medium">{t('footer.whitebook')}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
