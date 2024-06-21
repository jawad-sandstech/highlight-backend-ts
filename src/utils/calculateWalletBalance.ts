import type { USER_ROLES, Transactions } from '@prisma/client'

const calculateWalletBalance = (transactions: Transactions[], role: USER_ROLES): number => {
  if (role === 'BUSINESS') {
    const depositBalance = transactions
      .filter((transaction) => transaction.transactionType === 'DEPOSIT')
      .reduce((acc, current) => acc + current.amount, 0)

    const restTransactions = transactions
      .filter((transaction) => transaction.transactionType !== 'DEPOSIT')
      .reduce((acc, current) => acc + current.amount, 0)

    const walletBalance = depositBalance - restTransactions
    return walletBalance
  } else {
    return 0
  }
}

export default calculateWalletBalance
