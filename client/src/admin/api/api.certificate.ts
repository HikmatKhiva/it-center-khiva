const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/group`;
export async function generateGroupCertificate(id: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/finish/${id}`, {
      method: "PATCH",
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