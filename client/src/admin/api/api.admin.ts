const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1`;
export const uploadImage = async (
  data: FormData,
  token: string
): Promise<IMessageResponse> => {
  try {
    const response = await fetch(`${API_URL}/admin/upload-image`, {
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
};
