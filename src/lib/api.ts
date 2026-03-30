const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
  status?: string;
}

export interface Session {
  user: User;
  session: any;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  books?: Book[];
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  availability: boolean;
  isbn?: string;
  language?: string;
  year?: string;
  pages?: number;
  description?: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Borrowing {
  id: string;
  userId: string;
  user?: User;
  bookId: string;
  book?: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  fine: number;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  user?: User;
  membershipPlanId: string;
  membershipPlan?: MembershipPlan;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  startDate: string;
  endDate?: string;
  price: number;
}

export interface MembershipPlan {
  id: string;
  name: "BASIC" | "SILVER" | "GOLD";
  description: string;
  price: number;
  interval: string;
  features: string[];
  borrowLimit: number;
  durationDays: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  transactionId: string;
  status: "PAID" | "UNPAID";
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Common fetch wrapper for API calls
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Correct URL handling for endpoints starting with /
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Better Auth standard path in backend is /api/auth
  // Let's ensure we use the full path correctly.
  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }

  const headers = new Headers(fetchOptions.headers);
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("better-auth.session-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      // Also set X-Better-Auth-Session-Token header for Better Auth compatibility
      headers.set("X-Better-Auth-Session-Token", token);
      headers.set("better-auth-token", token);
    }
  }
  if (
    !headers.has("Content-Type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
      credentials: "include", // Important for session cookies
    });
  } catch (error) {
    console.error("Network error:", error);
    throw new Error(
      "Failed to connect to server. Please check if the backend is running."
    );
  }

  // Check if empty response (e.g. 204 No Content)
  const textContent = await response.text();
  let data: any = {};

  if (textContent) {
    try {
      data = JSON.parse(textContent);
    } catch {
      // If JSON parsing fails, check if it's an error response
      if (!response.ok) {
        // Return a meaningful error message instead of the raw text (which might be HTML)
        const error = new Error(
          `Error ${response.status}: ${response.statusText}`
        );
        (error as any).status = response.status;
        throw error;
      }
      return textContent as unknown as T;
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.error?.message ||
        data?.message ||
        data?.error ||
        `Error ${response.status}: ${response.statusText}`
    );
    (error as any).status = response.status;
    throw error;
  }

  return data as T;
}

/**
 * Auth API Endpoints
 */
export const authApi = {
  /**
   * @param userData { name, email, password, image, ...additionalFields }
   */
  signUp: async (userData: any) => {
    return fetchApi("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * @param credentials { email, password }
   */
  login: async (credentials: any) => {
    return fetchApi<Session>("/api/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser: async () => {
    return fetchApi<Session>("/api/auth/get-session", {
      method: "GET",
    });
  },

  logout: async () => {
    return fetchApi("/api/auth/sign-out", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },
};

/**
 * Category API Endpoints
 */
export const categoryApi = {
  getAll: async () => {
    return fetchApi<Category[]>("/api/v1/category", {
      method: "GET",
    });
  },

  getById: async (id: string) => {
    return fetchApi<Category>(`/api/v1/category/${id}`, {
      method: "GET",
    });
  },

  create: async (formData: FormData) => {
    return fetchApi<Category>("/api/v1/category", {
      method: "POST",
      body: formData,
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi<Category>(`/api/v1/category/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/api/v1/category/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * User Management API Endpoints
 */
export const userApi = {
  getAll: async () => {
    return fetchApi<User[]>("/api/v1/users", {
      method: "GET",
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi<User>(`/api/v1/users/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  softDelete: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/api/v1/users/${id}`, {
      method: "DELETE",
    });
  },

  createAdmin: async (adminData: any) => {
    return fetchApi<User>("/api/v1/users/create-admin", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  },
};

/**
 * Book API Endpoints
 */
export const bookApi = {
  getAll: async () => {
    return fetchApi<Book[]>("/api/v1/books", {
      method: "GET",
    });
  },

  getById: async (id: string) => {
    return fetchApi<Book>(`/api/v1/books/${id}`, {
      method: "GET",
    });
  },

  create: async (formData: FormData) => {
    return fetchApi<Book>("/api/v1/books", {
      method: "POST",
      body: formData,
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi<Book>(`/api/v1/books/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/api/v1/books/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Borrowing API Endpoints
 */
export const borrowingApi = {
  getAll: async () => {
    return fetchApi<Borrowing[]>("/api/v1/borrowings", {
      method: "GET",
    });
  },

  getById: async (id: string) => {
    return fetchApi<Borrowing>(`/api/v1/borrowings/${id}`, {
      method: "GET",
    });
  },

  create: async (data: { bookId: string; dueDate?: string }) => {
    return fetchApi<Borrowing>("/api/v1/borrowings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMyBorrowings: async () => {
    return fetchApi<Borrowing[]>("/api/v1/borrowings/my-borrowings", {
      method: "GET",
    });
  },
};

/**
 * Membership API Endpoints
 */
export const membershipApi = {
  getAll: async () => {
    return fetchApi<Membership[]>("/api/v1/memberships", {
      method: "GET",
    });
  },

  getActive: async () => {
    try {
      return await fetchApi<Membership>("/api/v1/memberships/my-membership", {
        method: "GET",
      });
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  update: async (id: string, data: Partial<Membership>) => {
    return fetchApi<Membership>(`/api/v1/memberships/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/api/v1/memberships/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Membership Plan API Endpoints
 */
export const membershipPlanApi = {
  getAll: async () => {
    try {
      return await fetchApi<MembershipPlan[]>("/api/v1/membership-plans", {
        method: "GET",
      });
    } catch (error: any) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
  },

  getById: async (id: string) => {
    return fetchApi<MembershipPlan>(`/api/v1/membership-plans/${id}`, {
      method: "GET",
    });
  },

  create: async (data: any) => {
    return fetchApi<MembershipPlan>("/api/v1/membership-plans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi<MembershipPlan>(`/api/v1/membership-plans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/api/v1/membership-plans/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Payment API Endpoints
 */
export const paymentApi = {
  initiate: async (data: {
    membershipPlanId: string;
    amount: number;
    currency?: string;
  }) => {
    return fetchApi<{ paymentUrl: string }>("/api/v1/payments/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verify: async (transactionId: string) => {
    return fetchApi<Payment>(`/api/v1/payments/verify/${transactionId}`, {
      method: "GET",
    });
  },
};

/**
 * Contact API Endpoints
 */
export const contactApi = {
  sendMessage: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    return fetchApi("/api/v1/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAllMessages: async () => {
    return fetchApi<any[]>("/api/v1/contact", {
      method: "GET",
    });
  },

  deleteMessage: async (id: string) => {
    return fetchApi<{ success: boolean }>(`/api/v1/contact/${id}`, {
      method: "DELETE",
    });
  },
};
