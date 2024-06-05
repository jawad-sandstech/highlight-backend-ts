import type { UserWallet } from '@prisma/client'

const calculateWalletBalance = (transactions: UserWallet[]): number => {
  try {
    let totalDebit = 0
    let totalCredit = 0

    transactions.forEach((transaction) => {
      if (transaction.transactionType === 'DEBIT') {
        totalDebit += transaction.amount
      } else if (transaction.transactionType === 'CREDIT') {
        totalCredit += transaction.amount
      }
    })

    const walletBalance = totalCredit - totalDebit
    return walletBalance
  } catch (error) {
    throw Error('Error calculating wallet balance')
  }
}

export default calculateWalletBalance
