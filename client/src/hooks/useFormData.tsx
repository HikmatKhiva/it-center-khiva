import { useQuery } from "@tanstack/react-query";
import { Server } from "@/api/api";
interface IFormDataResponse {
  teachers: ISelect[];
  courses: ISelect[];
  rooms: ISelect[];
}
const useFormData = () => {
  const { data, isLoading } = useQuery<IFormDataResponse>({
    queryFn: () => Server<IFormDataResponse>(`form/data`, { method: "GET" }),
    queryKey: ["form", "data"],
  });
  return {
    teachers: data?.teachers || [],
    loading: isLoading,
    courses: data?.courses || [],
    rooms: data?.rooms,
  };
};
export default useFormData;
