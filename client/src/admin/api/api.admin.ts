const API_URL = `${import.meta.env.VITE_BACKEND_URL}api/v1`;
export const adminLogin = async (
  data: IAdminLogin
): Promise<ILoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
};
export const adminVerify = async (data: I2FAData): Promise<I2FAResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/admin/verify-2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    throw new Error(errorMessage);
  }
};
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
export const updateAdminProfile = async (data: IUserUpdate, token: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/update`, {
      method: "PUT",
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
};
export const getProfile = async (
  token: string,
  id: number
): Promise<IUserProfile> => {
  try {
    const response = await fetch(`${API_URL}/admin/profile/${id}`, {
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
};
export const adminPhotoDelete = async (
  token: string
): Promise<IMessageResponse> => {
  try {
    const response = await fetch(`${API_URL}/admin/photo-delete`, {
      method: "DELETE",
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
};
export const generateSecret = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/generate-secret`, {
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
};
// update reception status
export const updateReceptionStatus = async (
  token: string,
  value: { username: string; isActive: boolean }
): Promise<IMessageResponse> => {
  try {
    const response = await fetch(`${API_URL}/admin/reception/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(value),
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
