const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/newStudents`;
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
