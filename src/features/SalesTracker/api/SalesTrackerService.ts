import { axiosInstance } from "@/lib/api-client";
import type { ITransactions } from "@/app/types/transaction";

export const getTransactions = async (): Promise<ITransactions[]> => {
  try {
    const response = await axiosInstance.get("/transactions/");
    return response.data.transactions;
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    throw error;
  }
};

export const getTransactionByOrderId = async (
  orderId: string
): Promise<ITransactions> => {
  try {
    const response = await axiosInstance.get(`/transactions/${orderId}`);
    return response.data.transaction;
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    throw error;
  }
};
