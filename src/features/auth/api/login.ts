import { axiosInstance } from "@/lib/api-client";

export const login = async (username: string, password: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/login",
      { username, password },
      { withCredentials: true }
    );

    const accessToken = res.data.accessToken;
    return accessToken;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};
