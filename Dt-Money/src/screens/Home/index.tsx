import { useAuthContext } from '@/context/auth.context'
import { useTransactionContext } from '@/context/transaction.context'
import { useErrorHandler } from '@/shared/hooks/useErrorHandler'
import { useEffect } from 'react'
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ListHeader } from './ListHeader'
import { TransactionCard } from './TransactionCard'
import { EmptyList } from './EmptyList'
import { colors } from '@/shared/colors'
import { set } from 'date-fns'


export const Home = () => {
  const { handleLogout } = useAuthContext()
  const {
    fetchCategories,
    fetchTransactions,
    transactions,
    refreshTransactions,
    handleLoadings,
    loadings,
    loadMoreTransactions
  } = useTransactionContext()
  const { handleError } = useErrorHandler()

  const handleFetchCategories = async () => {
    try {
      handleLoadings({
        key: "initial",
        value: true
      })
      await fetchCategories()
    } catch (error) {
      handleError(error, "Falha ao buscar categorias")
    } finally {
      handleLoadings({
        key: "initial",
        value: false
      })
    }
  }

  const handleFetchInitialTransactions = async () => {
    try {
      await fetchTransactions({ page: 1 })
    } catch (error) {
      handleError(error, "Falha ao buscar transações")
    } finally {
      handleLoadings({
        key: "initial",
        value: false
      })
    }
  }

  const handleLoadMoreTransactions = async () => {
    try {
      handleLoadings({
        key: "loadMore",
        value: true
      })
      await loadMoreTransactions()
    } catch (error) {
      handleError(error, "Falha ao carregar mais transações")
    } finally {
      handleLoadings({
        key: "loadMore",
        value: false
      })
    }
  }

  const handleRefreshTransactions = async () => {
    try {
      handleLoadings({
        key: "refresh",
        value: true
      })
      await refreshTransactions()
    } catch (error) {
      handleError(error, "Falha ao atualizar transações")
    } finally {
      handleLoadings({
        key: "refresh",
        value: false
      })
    }
  }

  useEffect(() => {
    (async () => {
      await Promise.all([
        handleFetchCategories(),
        handleFetchInitialTransactions()
      ])
    })()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-background-primary">

      <FlatList
        className='bg-background-secondary'
        ListHeaderComponent={ListHeader}
        data={transactions}
        keyExtractor={(id) => `transaction-${id}`}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        refreshControl={
          <RefreshControl
            refreshing={loadings.refresh}
            onRefresh={handleRefreshTransactions}
          />
        }
        onEndReached={handleLoadMoreTransactions}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={loadings.initial ? null : EmptyList}
        ListFooterComponent={
          loadings.loadMore ? <ActivityIndicator color={colors['accent-brand-light']} size='large' /> : null
        }
      />

    </SafeAreaView>
  )
}
