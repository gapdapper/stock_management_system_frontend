import { axiosInstance } from "@/lib/api-client";

export const uploadProductImage = async (
  entityType: "product" | "variant",
  entityId: number,
  file: File,
): Promise<void> => {

  const routePrefix = entityType == "product" ? "products" : "productVariant";
  try {
    await axiosInstance.post(
      `/${routePrefix}/${entityId}/upload`,
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
