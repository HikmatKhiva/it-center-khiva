const URL_API = `${import.meta.env.VITE_BACKEND_URL}api/v1/teachers`;
// get all course
export async function getAllTeachers(
  query: IDefaultQuery,
  token: string
): Promise<ITeacherResponse> {
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  try {
    const response = await fetch(`${URL_API}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message || "Serverda xatolik!"}`);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// update a teacher
export async function updateTeacher(data: FormData, token: string, id: number) {
  try {
    const response = await fetch(`${URL_API}/update/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message || "Serverda xatolik!"}`);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// create a teacher
export async function createTeacher(data: FormData, token: string) {
  try {
    const response = await fetch(`${URL_API}/create`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: data,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message || "Serverda xatolik!"}`);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// delete a teacher
export async function deleteTeacher(id: number, token: string) {
  try {
    const response = await fetch(`${URL_API}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message || "Serverda xatolik!"}`);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// delete a teacher photo
export async function deleteTeacherPhoto(id: number, token: string) {
  try {
    const response = await fetch(`${URL_API}/deletePhoto/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message || "Serverda xatolik!"}`);
    }
    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
