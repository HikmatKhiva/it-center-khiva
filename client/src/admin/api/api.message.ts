const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/messages`;
export async function getMessages(
  query: { limit: number; page: number },
  token: string
): Promise<IMessagesResponse> {
  try {
    const params = new URLSearchParams({
      limit: query.limit.toString(),
      page: query.page.toString(),
    });
    const response = await fetch(`${API_URL}?${params}`, {
      method: "GET",
      headers: {
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
export async function deleteMessage(
  id: number,
  token: string
): Promise<IMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
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
