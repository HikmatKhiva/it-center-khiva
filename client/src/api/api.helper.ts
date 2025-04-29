const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1`;
import { saveAs } from "file-saver";
export async function getNewGroupList<T>(): Promise<T[]> {
  try {
    const response = await fetch(`${API_URL}/opened/group`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || "Serverda xatolik!"}`
      );
    }
    return (await response.json()) as T[];
  } catch (error: unknown) {
    // Shorthand error handling
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(`API call failed: ${errorMessage}`);
  }
}
export async function getCourseList() {
  try {
    const response = await fetch(`${API_URL}/list`, {
      method: "GET",
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
export async function getNews(query: {
  page: number;
  limit: number;
}): Promise<INewsResponse> {
  const params = new URLSearchParams({
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  try {
    const response = await fetch(`${API_URL}/news?${params}`, {
      method: "GET",
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
export const formData = async () => {
  try {
    const response = await fetch(`${API_URL}/form/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
export async function getDebtorStudents(
  token: string,
  query: IDebtorQuery
): Promise<IDebtorsResponse> {
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    month: query.month,
  });
  try {
    const response = await fetch(`${API_URL}/debtors?${params}`, {
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
// create anonym message
export async function anonymMessage(
  data: IAnonymMessage
): Promise<IMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/message/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
// get all certificates
export async function getAllCertificates(
  query: IDefaultQuery,
  token: string
): Promise<ICertificateResponse> {
  const params = new URLSearchParams({
    passport: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  try {
    const response = await fetch(`${API_URL}/certificate?${params}`, {
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
// download a certificate
export async function downloadCertificate(
  id: number,
  fullName: string,
  token: string
) {
  try {
    const response = await fetch(`${API_URL}/certificate/download/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const blob = await response.blob();
    saveAs(blob, fullName);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
