import { saveAs } from "file-saver";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1`;
const API_URL_ADMIN = `${import.meta.env.VITE_BACKEND_URL}api/v1/admin`;
interface IOptionAPI {
  method: string;
  body?: string | null | FormData | any;
  headers?: Record<string, string>;
  formData?: FormData;
  data?: any;
}
export async function Server<T>(url: string, options: IOptionAPI): Promise<T> {
  try {
    let { body, headers, method, formData, data } = options;
    if (body) {
      headers = headers || {};
      headers["Content-Type"] = "application/json";
    }
    if (formData) {
      body = formData;
      headers = headers || {};
      headers["Content-Type"] = "multipart/form-data";
    }
    if (data) {
      body = data;
    }
    const response = await fetch(`${API_URL}/${url}`, {
      method,
      headers,
      body,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.message || "Serverda xatolik!"}`);
    }
    return (await response.json()) as T;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
// download groups  certificate
export async function downloadGroupCertificate(
  id: number,
  token: string,
  name: string
) {
  try {
    const response = await fetch(
      `${API_URL_ADMIN}/download/certificate/${id}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      // Handle non-2xx responses (e.g., 404, 500)
      const errorText = await response.text(); // Or response.json() if the server sends JSON errors
      throw new Error(`Download failed: ${response.status} - ${errorText}`);
    }
    const blob = await response.blob(); // Get the response as a Blob
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `${name}.zip`; // Default filename

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    saveAs(blob, filename); // Trigger the download
    return { success: true }; // Indicate successful download (optional)
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
