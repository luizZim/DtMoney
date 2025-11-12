import { TransactionTypes } from "@/shared/enums/transactions-types";
import { TransactionCardTypes } from "..";

interface CardData {
  label: string;
  bgColor: string;
}

export const CARD_DATA: Record<TransactionCardTypes, CardData> = {
  [TransactionTypes.EXPENSE]: {
    label: "Saída",
    bgColor: "background-tertiary"
  },
  [TransactionTypes.REVENUE]: {
    label: "Entrada",
    bgColor: "background-tertiary"
  },
  total: {
    label: "Total",
    bgColor: "accent-brand-background-primary"
  }
}