const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1`;
import { saveAs } from "file-saver";
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
