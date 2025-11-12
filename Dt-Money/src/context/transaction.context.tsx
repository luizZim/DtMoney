import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { Filters, Pagination } from "@/shared/interfaces/https/get-transactions-request";
import { TransactionCategory } from "@/shared/interfaces/https/transation-category-response";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import { TotalTransactions } from "@/shared/interfaces/total-transactions";
import { Transaction } from "@/shared/interfaces/transaction";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { set } from "date-fns";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { object } from "yup";


const filtersInitialValues = {
  categoryIds: {},
  typeId: undefined,
  from: undefined,
  to: undefined,
}

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

interface HandleFiltersParams {
  key: keyof Filters;
  value: Date | boolean | number;
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
  pagination: Pagination;
  setSearchText: (text: string) => void;
  searchText: string;
  filters: Filters;
  handleFilters: (params: HandleFiltersParams) => void;
  handleCategoryFilter: (categoryId: number) => void;
  resertFilters: () => void;
}

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<Filters>(filtersInitialValues)

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
    perPage: 15,
    totalRows: 0,
    totalPages: 0,
  })

  const categoryIds = useMemo(() => Object.entries(filters.categoryIds)
    .filter(([key, value]) => value)
    .map(([key]) => Number(key)),
    [filters.categoryIds])

  const handleLoadings = ({ key, value }: HandleLoadingsParams) => setLoadings((prevValue) => ({ ...prevValue, [key]: value }))

  const refreshTransactions = useCallback(async () => {
    const { page, perPage } = pagination
    const transactionsResponse = await transactionService.getTransactions({
      page: 1,
      perPage: page * perPage,
      ...filters,
      categoryIds,
    })
    setTransactions(transactionsResponse.data)
    setTotalTransactions(transactionsResponse.totalTransactions)
    setPagination({
      ...pagination,
      page,
      totalPages: transactionsResponse.totalPages,
      totalRows: transactionsResponse.totalRows,
    })
  }, [pagination, filters, categoryIds])


  const fetchCategories = async () => {
    const categoriesResponse = await transactionService.getTransactionCategories()
    setCategories(categoriesResponse)
  }

  const createTransaction = async (transaction: CreateTrasactionInterface) => {
    await transactionService.createTransaction(transaction)
    await refreshTransactions()
  }

  const fetchTransactions = useCallback(async ({ page = 1 }: FetchTransactionsParams) => {
    const transactionResponse = await transactionService.getTransactions({
      page,
      perPage: pagination.perPage,
      searchText,
      ...filters,
      categoryIds
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
  }, [pagination, searchText, filters, categoryIds]);

  const updateTransaction = async (transaction: UpdateTransactionInterface) => {
    await transactionService.updateTransaction(transaction)
    await refreshTransactions()
  }

  const loadMoreTransactions = useCallback(async () => {
    if (loadings.loadMore || pagination.page >= pagination.totalPages) return;
    fetchTransactions({ page: pagination.page + 1 })
  }, [loadings.loadMore, pagination])

  const handleFilters = ({ key, value }: HandleFiltersParams) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleCategoryFilter = (categoryId: number) => {
    setFilters((prevValue) => ({
      ...prevValue,
      categoryIds: {
        ...prevValue.categoryIds,
        [categoryId]: !Boolean(prevValue.categoryIds[categoryId])
      }
    }))
  }

  const resertFilters = useCallback(async () => {
    setFilters(filtersInitialValues)
    setSearchText("")

    const transactionResponse = await transactionService.getTransactions({
      page: 1,
      perPage: pagination.perPage,
      searchText: "",
      categoryIds: []
    });

    setTransactions(transactionResponse.data)
    setTotalTransactions(transactionResponse.totalTransactions)
    setPagination({
      ...pagination,
      page: 1,
      totalRows: transactionResponse.totalRows,
      totalPages: transactionResponse.totalPages,
    });
  }, []);

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
        loadMoreTransactions,
        pagination,
        setSearchText,
        searchText,
        filters,
        handleFilters,
        handleCategoryFilter,
        resertFilters
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => {
  return useContext(TransactionContext)
}