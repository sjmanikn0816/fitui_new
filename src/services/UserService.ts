import api from "@/services/api";
import { Endpoints } from "@/constants/endpoints";

export const deleteAccount = async (userId: number) => {
  if (!userId && userId !== 0) throw new Error("Invalid userId");
  const url = `${Endpoints.USER.DELETE}${userId}`;
  const res = await api.delete(url);
  return res.data;
};
