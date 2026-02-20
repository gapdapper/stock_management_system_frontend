import { axiosInstance } from "@/lib/api-client";

export const uploadVariantImage = async (
  variantId: number,
  file: File,
): Promise<void> => {
  try {
    await axiosInstance.post(
      `/productVariant/${variantId}/upload`,
      { image: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch upload logs:", error);
    throw error;
  }
};
