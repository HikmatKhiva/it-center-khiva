import { useQuery } from "@tanstack/react-query";
import { Server } from "@/api/api";
interface IFormDataResponse {
  teachers: ISelect[];
  courses: ISelect[];
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
  };
};
export default useFormData;
