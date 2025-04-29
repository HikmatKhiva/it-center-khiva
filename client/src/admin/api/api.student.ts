const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/students`;
// get all students
export async function getAllStudent(
  query: IDefaultQuery,
  token: string,
  groupId: number | undefined
): Promise<IStudentsResponse> {
  try {
    const params = new URLSearchParams({
      limit: query.limit.toString(),
      page: query.page.toString(),
      name: query.name,
      ...(groupId !== undefined && { groupId: groupId.toString() }),
    });
    const response = await fetch(`${API_URL}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
export async function getAStudent(
  id: number,
  token: string
): Promise<IStudent> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// create a student
export async function createStudent(
  data: IStudentCreate,
  token: string
): Promise<IMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// update a student
export async function updateStudent(data: IStudent, token: string, id: number) {
  try {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// delete a student
export async function deleteStudent(id: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
