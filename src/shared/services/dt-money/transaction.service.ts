import { dtMoneyApi } from "@/shared/api/dt-money";
import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { TransactionCategory } from "@/shared/interfaces/https/transation-category-response";

export const getTransactionCategories = async (): Promise<TransactionCategory[]> => {
  const { data } = await dtMoneyApi.get<TransactionCategory[]>(
    "/transaction/categories"
  );
  return data;
}

export const createTransaction = async (
  transaction: CreateTrasactionInterface
) => {
  await dtMoneyApi.post("/transaction", transaction);
}