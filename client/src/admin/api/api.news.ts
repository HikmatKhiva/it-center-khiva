const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/news`;
export async function createNews(formData: FormData, token: string) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      body: formData,
      headers: {
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
export async function updateNews(
  formData: FormData,
  token: string,
  slug: string
) {
  try {
    const response = await fetch(`${API_URL}/update/${slug}`, {
      method: "PUT",
      body: formData,
      headers: {
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
export async function getAllNews(query: IDefaultQuery): Promise<INewsResponse> {
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  try {
    const response = await fetch(`${API_URL}?${params}`, {
      method: "GET",
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
export async function getNews(slug: string): Promise<INews> {
  try {
    const response = await fetch(`${API_URL}/${slug}`, {
      method: "GET",
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
export async function deleteNews(id: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
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
