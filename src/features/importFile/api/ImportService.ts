import type { IUploadLog } from "@/types/uploadlog";
import { axiosInstance } from "@/lib/api-client";

export const importFile = async (formData: FormData): Promise<void> => {
  try {
    await axiosInstance.post("/transactions/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    throw error;
  }
};

export const getUploadLog = async (): Promise<IUploadLog> => {
    try {
        const response =  await axiosInstance.get('/dailyUploadLog');
        return response.data.uploadLog;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}