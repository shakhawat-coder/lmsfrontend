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

/**
 * Common fetch wrapper for API calls
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit & { params?: Record<string, string> } = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Correct URL handling for endpoints starting with /
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Better Auth standard path in backend is /api/auth
    // Let's ensure we use the full path correctly.
    const url = new URL(`${baseUrl}${cleanEndpoint}`);

    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url.toString(), {
        ...fetchOptions,
        headers,
        credentials: 'include', // Important for session cookies
    });

    // Check if empty response (e.g. 204 No Content)
    const textContent = await response.text();
    const data = textContent ? JSON.parse(textContent) : {};

    if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Something went wrong');
    }

    return data;
}

/**
 * Auth API Endpoints (Implementing Better Auth standard endpoints)
 */
export const authApi = {
    /**
     * @param userData { name, email, password, image, ...additionalFields }
     */
    signUp: async (userData: any) => {
        return fetchApi('/api/auth/sign-up/email', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    /**
     * @param credentials { email, password }
     */
    login: async (credentials: any) => {
        return fetchApi<Session>('/api/auth/sign-in/email', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    getCurrentUser: async () => {
        return fetchApi<Session>('/api/auth/get-session', {
            method: 'GET',
        });
    },

    logout: async () => {
        return fetchApi('/api/auth/sign-out', {
            method: 'POST',
            body: JSON.stringify({}),
        });
    }
};
