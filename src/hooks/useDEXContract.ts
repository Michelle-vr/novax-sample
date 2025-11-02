import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, type Address } from 'viem'
import { DEX_CONTRACT_ADDRESS, DEX_CONTRACT_ABI, ERC20_ABI, TOKEN_ADDRESSES } from '../contracts/DEXContract'
import { useNotification } from '../context/NotificationContext'
import { useState, useCallback } from 'react'

export const useDEXSwap = () => {
  const { address } = useAccount()
  const { success, error } = useNotification()
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)
  const [txHash, setTxHash] = useState<Address | undefined>()

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash
  })

  const swapTokens = useCallback(async (
    fromToken: string,
    toToken: string,
    amountIn: string,
    slippage = 0.5
  ) => {
    if (!address) {
      error('Wallet Not Connected', 'Please connect your wallet first')
      return
    }

    setIsPending(true)

    try {
      // Get token addresses
      const fromTokenAddress = TOKEN_ADDRESSES[fromToken]
      const toTokenAddress = TOKEN_ADDRESSES[toToken]

      if (!fromTokenAddress || !toTokenAddress) {
        throw new Error('Token not supported')
      }

      // Parse amount
      const amountInWei = parseUnits(amountIn, 18)

      // Get expected output amount (simplified - in production, use getAmountsOut)
      const path: Address[] = [fromTokenAddress, toTokenAddress]

      // Calculate minimum output with slippage
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes

      // First, approve the router to spend tokens
      const approveTx = await writeContractAsync({
        address: fromTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [DEX_CONTRACT_ADDRESS as Address, amountInWei]
      })

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Execute swap
      const swapTx = await writeContractAsync({
        address: DEX_CONTRACT_ADDRESS as Address,
        abi: DEX_CONTRACT_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInWei,
          BigInt(0), // In production, calculate proper amountOutMin with slippage
          path,
          address,
          deadline
        ]
      })

      setTxHash(swapTx)

      success(
        'Swap Initiated',
        `Swapping ${amountIn} ${fromToken} for ${toToken}`,
        swapTx
      )

      return swapTx
    } catch (err) {
      error('Swap Failed', err instanceof Error ? err.message : 'Transaction was rejected')
      throw err
    } finally {
      setIsPending(false)
    }
  }, [address, writeContractAsync, success, error])

  return {
    swapTokens,
    isPending,
    isConfirmed,
    txHash
  }
}

export const useAddLiquidity = () => {
  const { address } = useAccount()
  const { success, error } = useNotification()
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)

  const addLiquidity = useCallback(async (
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string
  ) => {
    if (!address) {
      error('Wallet Not Connected', 'Please connect your wallet first')
      return
    }

    setIsPending(true)

    try {
      const tokenAAddress = TOKEN_ADDRESSES[tokenA]
      const tokenBAddress = TOKEN_ADDRESSES[tokenB]

      if (!tokenAAddress || !tokenBAddress) {
        throw new Error('Token not supported')
      }

      const amountAWei = parseUnits(amountA, 18)
      const amountBWei = parseUnits(amountB, 18)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

      // Approve both tokens
      await writeContractAsync({
        address: tokenAAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [DEX_CONTRACT_ADDRESS as Address, amountAWei]
      })

      await writeContractAsync({
        address: tokenBAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [DEX_CONTRACT_ADDRESS as Address, amountBWei]
      })

      // Add liquidity
      const tx = await writeContractAsync({
        address: DEX_CONTRACT_ADDRESS as Address,
        abi: DEX_CONTRACT_ABI,
        functionName: 'addLiquidity',
        args: [
          tokenAAddress,
          tokenBAddress,
          amountAWei,
          amountBWei,
          BigInt(0), // In production, calculate proper min amounts
          BigInt(0),
          address,
          deadline
        ]
      })

      success(
        'Liquidity Added',
        `Added ${amountA} ${tokenA} and ${amountB} ${tokenB}`,
        tx
      )

      return tx
    } catch (err) {
      error('Add Liquidity Failed', err instanceof Error ? err.message : 'Transaction was rejected')
      throw err
    } finally {
      setIsPending(false)
    }
  }, [address, writeContractAsync, success, error])

  return {
    addLiquidity,
    isPending
  }
}

export const useRemoveLiquidity = () => {
  const { address } = useAccount()
  const { success, error } = useNotification()
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)

  const removeLiquidity = useCallback(async (
    tokenA: string,
    tokenB: string,
    liquidity: string
  ) => {
    if (!address) {
      error('Wallet Not Connected', 'Please connect your wallet first')
      return
    }

    setIsPending(true)

    try {
      const tokenAAddress = TOKEN_ADDRESSES[tokenA]
      const tokenBAddress = TOKEN_ADDRESSES[tokenB]

      if (!tokenAAddress || !tokenBAddress) {
        throw new Error('Token not supported')
      }

      const liquidityWei = parseUnits(liquidity, 18)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

      const tx = await writeContractAsync({
        address: DEX_CONTRACT_ADDRESS as Address,
        abi: DEX_CONTRACT_ABI,
        functionName: 'removeLiquidity',
        args: [
          tokenAAddress,
          tokenBAddress,
          liquidityWei,
          BigInt(0), // In production, calculate proper min amounts
          BigInt(0),
          address,
          deadline
        ]
      })

      success(
        'Liquidity Removed',
        `Removed liquidity from ${tokenA}/${tokenB} pool`,
        tx
      )

      return tx
    } catch (err) {
      error('Remove Liquidity Failed', err instanceof Error ? err.message : 'Transaction was rejected')
      throw err
    } finally {
      setIsPending(false)
    }
  }, [address, writeContractAsync, success, error])

  return {
    removeLiquidity,
    isPending
  }
}

export const useTokenBalance = (tokenSymbol: string) => {
  const { address } = useAccount()
  const tokenAddress = TOKEN_ADDRESSES[tokenSymbol]

  const { data: balance, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress
    }
  })

  return {
    balance: balance ? formatUnits(balance as bigint, 18) : '0',
    refetch
  }
}
