import { colors } from "@/shared/colors";
import { TransactionTypes } from "@/shared/enums/transactions-types";
import { TransactionCardTypes } from "..";
import { MaterialIcons } from '@expo/vector-icons';

interface IconsData {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export const ICONS: Record<TransactionCardTypes, IconsData> = {
  [TransactionTypes.REVENUE]: {
    color: colors["accent-brand-light"],
    name: "arrow-circle-up"
  },
  [TransactionTypes.EXPENSE]: {
    color: colors["accent-red"],
    name: "arrow-circle-down"
  },
  total: {
    name: "attach-money",
    color: colors.white
  }
}