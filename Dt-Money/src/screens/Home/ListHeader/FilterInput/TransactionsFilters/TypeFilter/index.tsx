import { useTransactionContext } from "@/context/transaction.context"
import { TransactionTypes } from "@/shared/enums/transactions-types"
import Checkbox from "expo-checkbox"
import { View, Text, TouchableOpacity } from "react-native"


export const TypeFilter = () => {
  const { filters, handleFilters } = useTransactionContext()

  const selectType = (typeId: TransactionTypes) => {
    handleFilters({ key: "typeId", value: typeId })
  }

  return (
    <View className="mb-6">
      <Text className='text-base font-medium mb-5 text-gray-600'>Tipo de transação</Text>

      <TouchableOpacity
        onPress={() => selectType(TransactionTypes.REVENUE)}
        className="flex-row items-center py-2"
      >
        <Checkbox
          value={filters.typeId === TransactionTypes.REVENUE}
          onValueChange={() => selectType(TransactionTypes.REVENUE)}
          className="mr-4"
        />
        <Text className="text-lg text-white">Entrada</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => selectType(TransactionTypes.EXPENSE)}
        className="flex-row items-center py-2"
      >
        <Checkbox
          value={filters.typeId === TransactionTypes.EXPENSE}
          onValueChange={() => selectType(TransactionTypes.EXPENSE)}
          className="mr-4"
        />
        <Text className="text-lg text-white">Saída</Text>
      </TouchableOpacity>
    </View>
  )
}