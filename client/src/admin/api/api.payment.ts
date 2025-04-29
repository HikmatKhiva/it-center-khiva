const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1/payment`;
// get payments a student
export async function getPayments(
  id: number,
  token: string
): Promise<IPaymentsResponse> {
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
// update a student
export async function uploadPayment(
  data: INewPayment,
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