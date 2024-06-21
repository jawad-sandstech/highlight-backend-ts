import prisma from '../config/database.config'

import type { Transactions } from '@prisma/client'

type WalletSummary = {
  walletBalance: number
  transactions: Transactions[]
}

const calculateWalletBalance = async (userId: number): Promise<WalletSummary> => {
  const user = await prisma.users.findUnique({ where: { id: userId } })

  if (user === null) {
    throw Error('user not found')
  }

  const { id, role } = user

  if (role === 'BUSINESS') {
    const transactions = await prisma.transactions.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    const depositBalance = transactions
      .filter((transaction) => transaction.transactionType === 'DEPOSIT')
      .reduce((acc, current) => acc + current.amount, 0)

    const restTransactions = transactions
      .filter((transaction) => transaction.transactionType !== 'DEPOSIT')
      .reduce((acc, current) => acc + current.amount, 0)

    const walletBalance = depositBalance - restTransactions

    return { walletBalance, transactions }
  } else if (role === 'ATHLETE') {
    // earned calculations
    const completedJobs = await prisma.jobApplications.findMany({
      where: { userId: id, status: 'COMPLETED' },
      select: { jobId: true }
    })

    const jobIds = completedJobs.map((jobApplication) => jobApplication.jobId)

    const transactionPromises = jobIds.map(async (jobId): Promise<Transactions[]> => {
      return await prisma.transactions.findMany({
        where: {
          transactionType: 'PAYMENT',
          source: {
            path: '$.recourseId',
            equals: jobId
          }
        }
      })
    })

    const resolvedTransactions = await Promise.all(transactionPromises)
    const paymentsTransactions = resolvedTransactions.flat()
    const paymentsBalance = paymentsTransactions.reduce((acc, current) => acc + current.amount, 0)

    // withdraw calculations
    const withdrawalTransactions = await prisma.transactions.findMany({
      where: { userId: id }
    })

    const withdrawalBalance = withdrawalTransactions.reduce(
      (acc, current) => acc + current.amount,
      0
    )

    const walletBalance = paymentsBalance - withdrawalBalance

    const transactions = [...paymentsTransactions, ...withdrawalTransactions].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    return { walletBalance, transactions }
  } else {
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const walletBalance = transactions
      .filter((transaction) => transaction.transactionType === 'FEE')
      .reduce((acc, current) => acc + current.amount, 0)

    return { walletBalance, transactions }
  }
}

export default calculateWalletBalance
