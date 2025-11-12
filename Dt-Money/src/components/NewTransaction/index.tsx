import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request"
import { useState } from "react"
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { colors } from "@/shared/colors"
import { useBottomSheetContext } from "@/context/bottomsheet.context"
import { TextInput } from "react-native-gesture-handler"
import CurrencyInput from "react-native-currency-input"
import { TransactionTypeSelector } from "../SelectType"
import { SelectCategoryModal } from "../SelectCategoryModal"
import { transactionSchema } from "./schema"
import * as yup from 'yup'
import { AppButton } from "../AppButton"
import { ErrorMessage } from "../ErrorMessage"
import { useTransactionContext } from "@/context/transaction.context"
import { useErrorHandler } from "@/shared/hooks/useErrorHandler"

type ValidationErrorsTypes = Record<keyof CreateTrasactionInterface, string>

export const NewTransaction = () => {
  const { closeBottomSheet } = useBottomSheetContext()
  const { createTransaction } = useTransactionContext()
  const { handleError } = useErrorHandler()

  const [isLoading, setIsLoading] = useState(false)

  const [transaction, setTransaction] = useState<CreateTrasactionInterface>({
    description: '',
    typeId: 0,
    categoryId: 0,
    value: 0,
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrorsTypes>()

  const handleCreateTransaction = async () => {
    try {
      setIsLoading(true)
      await transactionSchema.validate(transaction, {
        abortEarly: false,
      });
      await createTransaction(transaction);
      closeBottomSheet();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = {} as ValidationErrorsTypes

        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof CreateTrasactionInterface] = err.message
          }
        });

        setValidationErrors(errors)
      } else {
        handleError("Falha ao criar transação.")
      }
    } finally {
      setIsLoading(false)
    }
  }

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
        {
          validationErrors?.description && <ErrorMessage>{validationErrors.description}</ErrorMessage>
        }
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
        {
          validationErrors?.value && <ErrorMessage>{validationErrors.value}</ErrorMessage>
        }
        <SelectCategoryModal
          selectedCategory={transaction.categoryId}
          onSelect={(categoryId) => setTransactionData("categoryId", categoryId)}
        />
        {
          validationErrors?.categoryId && <ErrorMessage>{validationErrors.categoryId}</ErrorMessage>
        }
        <TransactionTypeSelector
          typeId={transaction.typeId}
          setTransationType={(typeId) => setTransactionData("typeId", typeId)}
        />
        {
          validationErrors?.typeId && <ErrorMessage>{validationErrors.typeId}</ErrorMessage>
        }
        <View className="my-4">
          <AppButton onPress={handleCreateTransaction}>
            {isLoading ? <ActivityIndicator color={colors.white} /> : "Cadastrar"}
          </AppButton>
        </View>
      </View>
    </View >
  )
}