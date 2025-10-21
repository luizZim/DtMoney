import { AppHeader } from "@/components/AppHeader"
import { View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { TransactionCard } from "./TransactionCard"
import { TransactionTypes } from "@/shared/enums/transactions-types";
import { useTransactionContext } from "@/context/transaction.context";

export const ListHeader = () => {

  const { totalTransactions } = useTransactionContext()

  return (
    <>
      <AppHeader />
      <View className="h-[150px] w-full">
        <View className="h-[50] bg-background-primary" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="absolute pl-6 h-[141]">

          <TransactionCard type={TransactionTypes.EXPENSE} amount={totalTransactions.expense} />
          <TransactionCard type={TransactionTypes.REVENUE} amount={totalTransactions.revenue} />
          <TransactionCard type={"total"} amount={totalTransactions.total} />
        </ScrollView>
      </View>
    </>
  )
}