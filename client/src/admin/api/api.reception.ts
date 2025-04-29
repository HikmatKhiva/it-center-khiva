const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/admin`;
//  create a account for reception
export async function createReceptionAccount(
  data: IUserRegister,
  token: string
): Promise<IMessageResponse> {
  try {
    const response = await fetch(`${API_URL}/reception/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
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
//  create a course
export async function getReceptionAccounts(
  token: string
): Promise<IReceptionResponse> {
  try {
    const response = await fetch(`${API_URL}/reception`, {
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
// delete reception account
export async function deleteReceptionAccount(token: string, id: number) {
  try {
    const response = await fetch(`${API_URL}/reception/delete/${id}`, {
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
