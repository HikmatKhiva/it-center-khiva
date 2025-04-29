import { useQuery } from "@tanstack/react-query";
import { formData } from "@/api/api.helper";
const useFormData = () => {
  const { data, isLoading } = useQuery({
    queryFn: formData,
    queryKey: ["form", "data"],
  });
  return {
    teachers: data?.teachers,
    loading: isLoading,
    courses: data?.courses,
  };
};
export default useFormData;