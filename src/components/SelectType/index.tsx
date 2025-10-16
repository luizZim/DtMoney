import { TransactionTypes } from "@/shared/enums/transactions-types";
import { FC } from "react";
import { TouchableOpacity, View, Text } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import clsx from "clsx";
import { colors } from "@/shared/colors";


interface Props {
  setTransationType: (type: TransactionTypes) => void;
  typeId?: number;
}

export const TransactionTypeSelector: FC<Props> = ({
  setTransationType,
  typeId
}) => {
  return (
    <View className="flex-row justify-between gap-2 mt-2">
      <TouchableOpacity
        onPress={() => setTransationType(TransactionTypes.REVENUE)}
        className={clsx(
          'flex-row items-center p-2 flex-1 justify-center h-[58] rounded-lg',
          typeId === TransactionTypes.REVENUE ? "bg-accent-brand" : "bg-background-tertiary",
        )}
      >
        <MaterialIcons
          name="arrow-circle-up"
          color={
            typeId === TransactionTypes.REVENUE
              ? colors.white
              : colors['accent-brand-light']}
          size={30}
          className="mr-2"
        />
        <Text className="text-white font-bold">Entrada</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setTransationType(TransactionTypes.EXPENSE)}
        className={clsx(
          'flex-row items-center p-2 flex-1 justify-center h-[58] rounded-lg',
          typeId === TransactionTypes.EXPENSE ? "bg-accent-red" : "bg-background-tertiary",
        )}
      >
        <MaterialIcons
          name="arrow-circle-down"
          color={
            typeId === TransactionTypes.EXPENSE
              ? colors.white
              : colors['accent-red']}
          size={30}
          className="mr-2"
        />
        <Text className="text-white font-bold">Saída</Text>
      </TouchableOpacity>
    </View>
  )
}