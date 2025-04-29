import { saveAs } from "file-saver";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/group`;
const API_URL_ADMIN = `${import.meta.env.VITE_BACKEND_URL}api/v1/admin`;
// create a new group
export async function createGroup(
  data: INewGroup,
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
// update a group
export async function updateGroup(
  id: number,
  token: string,
  data: INewGroup
): Promise<IMessageResponse> {
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
// get all group
export async function getAllGroup(
  query: IGroupQuery,
  token: string
): Promise<GroupQueryResponse> {
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    isGroupFinished: query.isGroupFinished.toString(),
  });
  try {
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
// get a group
export async function getGroup(id: number, token: string): Promise<IGroup> {
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
// delete a group
export async function deleteGroup(
  id: number,
  token: string
): Promise<IMessageResponse> {
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
// get admin  stats
export async function getAdminStats(token: string) {
  try {
    const response = await fetch(`${API_URL_ADMIN}/stats`, {
      method: "GET",
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