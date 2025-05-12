const URL_API = `${import.meta.env.VITE_BACKEND_URL}api/v1/teachers`;
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