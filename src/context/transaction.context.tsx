import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { Pagination } from "@/shared/interfaces/https/get-transactions-request";
import { TransactionCategory } from "@/shared/interfaces/https/transation-category-response";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import { TotalTransactions } from "@/shared/interfaces/total-transactions";
import { Transaction } from "@/shared/interfaces/transaction";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useState } from "react";



interface FetchTransactionsParams {
  page?: number;
}

interface Loadings {
  initial: boolean;
  refresh: boolean;
  loadMore: boolean;
}

interface HandleLoadingsParams {
  key: keyof Loadings;
  value: boolean;
}

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTrasactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
  fetchTransactions: (params: FetchTransactionsParams) => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  loadings: Loadings;
  handleLoadings: (params: HandleLoadingsParams) => void
}

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadings, setLoadings] = useState<Loadings>({
    initial: false,
    refresh: false,
    loadMore: false
  })
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>({
    expense: 0,
    revenue: 0,
    total: 0,
  })

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 3,
    totalRows: 0,
    totalPages: 0,
  })

  const handleLoadings = ({ key, value }: HandleLoadingsParams) => setLoadings((prevValue) => ({ ...prevValue, [key]: value }))

  const refreshTransactions = async () => {
    const { page, perPage } = pagination;



    const transactionResponse = await transactionService.getTransactions({
      page: page,
      perPage: page * perPage,
    });
    console.log(transactionResponse);
    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions)
    setPagination({
      ...pagination,
      page,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    })
  }


  const fetchCategories = async () => {
    const categoriesResponse = await transactionService.getTransactionCategories()
    setCategories(categoriesResponse)
  }

  const createTransaction = async (transaction: CreateTrasactionInterface) => {
    await transactionService.createTransaction(transaction)
    await refreshTransactions()
  }

  const fetchTransactions = useCallback(async ({ page = 1 }: FetchTransactionsParams) => {
    ;

    const transactionResponse = await transactionService.getTransactions({
      page,
      perPage: pagination.perPage,
    });

    if (page === 1) {
      setTransactions(transactionResponse.data)
    } else {
      setTransactions((prevState) => [...prevState, ...transactionResponse.data])
    }
    setTotalTransactions(transactionResponse.totalTransactions)
    setPagination({
      ...pagination,
      page,
      totalRows: transactionResponse.totalRows,
      totalPages: transactionResponse.totalPages,
    });
  }, [pagination])

  const updateTransaction = async (transaction: UpdateTransactionInterface) => {
    await transactionService.updateTransaction(transaction)
    await refreshTransactions()
  }

  const loadMoreTransactions = useCallback(async () => {
    if (loadings.loadMore || pagination.page >= pagination.totalPages) return;
    fetchTransactions({ page: pagination.page + 1 })
  }, [loadings.loadMore, pagination])

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
        handleLoadings,
        loadings,
        loadMoreTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => {
  return useContext(TransactionContext)
}