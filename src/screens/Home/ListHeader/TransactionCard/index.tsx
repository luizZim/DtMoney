import { colors } from "@/shared/colors";
import { TransactionTypes } from "@/shared/enums/transactions-types"
import { FC } from "react";
import { View, Text } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import { useTransactionContext } from "@/context/transaction.context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ICONS } from "./strategies/icon-strategy";
import { CARD_DATA } from "./strategies/card-data-strategy";
import { MoneyMapper } from "@/shared/utils/money-mapper";
import clsx from "clsx";

export type TransactionCardTypes = TransactionTypes | "total";

interface Props {
  type: TransactionCardTypes
  amount: number;
}

export const TransactionCard: FC<Props> = ({ type, amount }) => {

  const iconData = ICONS[type]
  const cardData = CARD_DATA[type]

  const { transactions } = useTransactionContext();

  const lastTransaction = transactions.find(({ type: transactionType }) => transactionType.id === type)

  return (
    <View className={clsx(`bg-${cardData.bgColor} min-w-[280] rounded-[6] px-8 py-6 justify-between mr-6`, type === "total" && "mr-12")}>
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-base">{cardData.label}</Text>

        <MaterialIcons
          name={iconData.name}
          color={iconData.color}
          size={26}
        />
      </View>
      <View>
        <Text className="text-2xl text-gray-400 font-bold">R$ {MoneyMapper(amount)}</Text>

        {type !== "total" && (
          <Text className="text-gray-700">
            {lastTransaction?.createdAt ?
              format(lastTransaction?.createdAt,
                `'Última ${cardData.label.toLowerCase()} em' d  'de' MMMM`,
                { locale: ptBR }
              ) : "Nenhuma Transação encontrada"}
          </Text>
        )}
      </View>
    </View>
  )
}