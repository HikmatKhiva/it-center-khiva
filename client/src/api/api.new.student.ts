const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/newStudents`;
// get all students
export async function getAllNewStudents(
  query: IQueryStudent,
  token: string
): Promise<INewStudentResponse> {
  const params = new URLSearchParams({
    isAttend: query.isAttend,
    month: query.month,
    courseTime: query.courseTime,
    courseId: query.courseId,
    limit: query.limit.toString(),
    page: query.page.toString(),
  });
  try {
    const response = await fetch(`${API_URL}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || "Serverda xatolik!"}`
      );
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(`API call failed: ${errorMessage}`);
  }
}
export const updateNewStudentStatus = async (
  id: number,
  status: string,
  token: string
): Promise<IMessageResponse> => {
  try {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || "Serverda xatolik!"}`
      );
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(`API call failed: ${errorMessage}`);
  }
};
export const deleteNewStudentStatus = async (
  id: number,
  token: string
): Promise<IMessageResponse> => {
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || "Serverda xatolik!"}`
      );
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(`API call failed: ${errorMessage}`);
  }
};
// create a student
export async function addNewStudent(
  data: INewStudentCreate
): Promise<IMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || "Serverda xatolik!"}`
      );
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(`API call failed: ${errorMessage}`);
  }
}
