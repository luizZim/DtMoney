import { TransactionCategory } from "@/shared/interfaces/https/transation-category-response";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useState } from "react";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { TotalTransactions } from "@/shared/interfaces/total-transactions";
import { Transaction } from "@/shared/interfaces/transaction";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import { set } from "date-fns";

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTrasactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions?: () => Promise<void>;
  loading: boolean;
}

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>({
    expense: 0,
    revenue: 0,
    total: 0,
  })

  const refreshTransactions = async () => {
    setIsLoading(true);
    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: 10,
    });
    console.log(transactionResponse);
    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions)
    setIsLoading(false);
  }


  const fetchCategories = async () => {
    const categoriesResponse = await transactionService.getTransactionCategories()
    setCategories(categoriesResponse)
  }

  const createTransaction = async (transaction: CreateTrasactionInterface) => {
    await transactionService.createTransaction(transaction)
    await refreshTransactions()
  }

  const fetchTransactions = useCallback(async () => {
    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: 10,
    });
    console.log(transactionResponse);
    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions)
  }, [])

  const updateTransaction = async (transaction: UpdateTransactionInterface) => {
    await transactionService.updateTransaction(transaction)
    await refreshTransactions()
  }

  return (
    <TransactionContext.Provider
      value={{
        categories,
        fetchCategories,
        createTransaction,
        fetchTransactions,
        totalTransactions,
        transactions,
        updateTransaction,
        refreshTransactions,
        loading: isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => {
  return useContext(TransactionContext)
}