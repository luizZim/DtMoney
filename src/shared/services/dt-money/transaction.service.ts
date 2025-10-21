import { dtMoneyApi } from "@/shared/api/dt-money";
import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { GetTransactionsParams, GetTransactionsResponse } from "@/shared/interfaces/https/get-transactions-request";
import { TransactionCategory } from "@/shared/interfaces/https/transation-category-response";
import qs from "qs"

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

export const getTransactions = async (params: GetTransactionsParams): Promise<GetTransactionsResponse> => {
  const { data } = await dtMoneyApi.get<GetTransactionsResponse>("/transaction", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });

  return data;
}