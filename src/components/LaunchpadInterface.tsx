import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Rocket,
  Clock,
  Users,
  Target,
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  Calendar
} from 'lucide-react'

interface LaunchpadInterfaceProps {
  onBack: () => void
}

interface Project {
  id: string
  name: string
  description: string
  logo: string
  status: 'upcoming' | 'live' | 'ended'
  progress: number
  raised: string
  target: string
  participants: string
  price: string
  starts: string
  ends: string
  allocation: string
  tags: string[]
}

const LaunchpadInterface: React.FC<LaunchpadInterfaceProps> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [investAmount, setInvestAmount] = useState('')

  const projects: Project[] = [
    {
      id: '1',
      name: 'MetaVerse AI',
      description: 'Next-generation AI-powered metaverse platform with decentralized governance',
      logo: '🌌',
      status: 'live',
      progress: 75,
      raised: '$1,875,000',
      target: '$2,500,000',
      participants: '2,450',
      price: '$0.15',
      starts: '2024-01-10',
      ends: '2024-01-20',
      allocation: '50,000 - 500,000',
      tags: ['AI', 'Metaverse', 'Gaming']
    },
    {
      id: '2',
      name: 'DeFi Protocol X',
      description: 'Revolutionary cross-chain DeFi protocol with advanced yield optimization',
      logo: '⚡',
      status: 'upcoming',
      progress: 0,
      raised: '$0',
      target: '$3,000,000',
      participants: '0',
      price: '$0.25',
      starts: '2024-01-25',
      ends: '2024-02-05',
      allocation: '10,000 - 100,000',
      tags: ['DeFi', 'Cross-chain', 'Yield']
    },
    {
      id: '3',
      name: 'GameFi Arena',
      description: 'Play-to-earn gaming ecosystem with NFT marketplace integration',
      logo: '🎮',
      status: 'ended',
      progress: 100,
      raised: '$1,800,000',
      target: '$1,800,000',
      participants: '3,200',
      price: '$0.10',
      starts: '2023-12-01',
      ends: '2023-12-15',
      allocation: 'Filled',
      tags: ['GameFi', 'NFT', 'P2E']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ended':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
      default:
        return 'bg-zinc-500/20 text-zinc-400'
    }
  }

  const handleInvest = (projectId: string) => {
    console.log('Investing in project:', projectId, 'Amount:', investAmount)
    // Investment logic here
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
              Launchpad
            </h1>
            <p className="text-zinc-400 mt-1">Discover and invest in vetted blockchain projects</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Raised', value: '$12.5M', icon: TrendingUp },
            { label: 'Projects Launched', value: '127', icon: Rocket },
            { label: 'Active Investors', value: '18.5K', icon: Users },
            { label: 'Success Rate', value: '94%', icon: Target }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-4 backdrop-blur-md text-center"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">{stat.value}</div>
              <div className="text-xs text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-md"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{project.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-100">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                      {project.status === 'live' && (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Live Now
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {project.status !== 'ended' && (
                  <button className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors">
                    <Star size={20} className="text-yellow-400" />
                  </button>
                )}
              </div>

              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zinc-800/50 text-zinc-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-zinc-400">Progress</span>
                  <span className="text-yellow-400 font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-600 to-amber-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="text-xs text-zinc-400 mb-1">Raised</div>
                  <div className="text-lg font-bold text-white">{project.raised}</div>
                  <div className="text-xs text-zinc-500">of {project.target}</div>
                </div>

                <div className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="text-xs text-zinc-400 mb-1">Participants</div>
                  <div className="text-lg font-bold text-white">{project.participants}</div>
                  <div className="text-xs text-zinc-500">investors</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Token Price</span>
                  <span className="text-white font-medium">{project.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Allocation</span>
                  <span className="text-white font-medium">{project.allocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Calendar size={14} />
                    Timeline
                  </span>
                  <span className="text-white font-medium">
                    {new Date(project.starts).toLocaleDateString()} - {new Date(project.ends).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {project.status === 'live' && (
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Enter USDT amount"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="w-full bg-zinc-800/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                  <button
                    onClick={() => handleInvest(project.id)}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket size={18} />
                    Invest Now
                  </button>
                </div>
              )}

              {project.status === 'upcoming' && (
                <button
                  className="w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg font-bold transition-all hover:bg-blue-600/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock size={18} />
                    Starts {new Date(project.starts).toLocaleDateString()}
                  </div>
                </button>
              )}

              {project.status === 'ended' && (
                <div className="py-3 bg-zinc-800/30 text-zinc-400 rounded-lg font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  Completed
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Security Info */}
        <motion.div
          className="mt-8 bg-gradient-to-br from-black/60 via-zinc-900/80 to-black/60 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-yellow-400" />
            <h3 className="text-xl font-bold text-amber-100">Security & Vetting</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-white mb-1">Audited Contracts</div>
                <div className="text-zinc-400">All projects undergo thorough smart contract audits</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-white mb-1">KYC Verified</div>
                <div className="text-zinc-400">Team members are KYC verified and doxxed</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-white mb-1">Liquidity Locked</div>
                <div className="text-zinc-400">Liquidity tokens are locked for investor protection</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LaunchpadInterface
