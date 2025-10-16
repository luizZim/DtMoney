import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request"
import { useState } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { colors } from "@/shared/colors"
import { useBottomSheetContext } from "@/context/bottomsheet.context"
import { TextInput } from "react-native-gesture-handler"
import CurrencyInput from "react-native-currency-input"
import { TransactionTypeSelector } from "../SelectType"
import { SelectCategoryModal } from "../SelectCategoryModal"

export const NewTransaction = () => {
  const { closeBottomSheet } = useBottomSheetContext()

  const [transaction, setTransaction] = useState<CreateTrasactionInterface>({
    description: '',
    typeId: 0,
    categoryId: 0,
    value: 0,
  })

  const setTransactionData = (
    key: keyof CreateTrasactionInterface,
    value: string | number
  ) => {
    setTransaction((prevData) => ({ ...prevData, [key]: value }));
  }

  return (
    <View className="px-8 py-5">
      <TouchableOpacity
        onPress={closeBottomSheet}
        className="w-full flex-row items-center justify-between"
      >
        <Text className="text-white text-xl font-bold">Nova Transação</Text>
        <MaterialIcons
          name="close"
          size={20}
          color={colors.gray["700"]}
        />
      </TouchableOpacity>
      <View className="flex-1 mt-8 mb-8">
        <TextInput
          onChangeText={(text) => setTransactionData("description", text)}
          className="text-white text-lg h-[50px] bg-background-primary my-2 rounded-[6] pl-4"
          placeholder="Descrição"
          placeholderTextColor={colors.gray["700"]}
          value={transaction.description}
        />
        <CurrencyInput
          className="text-white text-lg h-[50px] bg-background-primary my-2 rounded-[6] pl-4"
          value={transaction.value}
          prefix="R$ "
          delimiter="."
          separator=","
          precision={2}
          minValue={0}
          onChangeValue={(value) => setTransactionData("value", value ?? 0)}
        />

        <SelectCategoryModal
          selectedCategory={transaction.categoryId}
          onSelect={(categoryId) => setTransactionData("categoryId", categoryId)}
        />

        <TransactionTypeSelector
          typeId={transaction.typeId}
          setTransationType={(typeId) => setTransactionData("typeId", typeId)}
        />
      </View>
    </View >
  )
}