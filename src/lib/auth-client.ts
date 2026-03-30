import { createAuthClient } from "better-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const baseURL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

export const authClient = createAuthClient({
  baseURL: baseURL,
  fetchOptions: {
    credentials: "include", // Ensure cookies are sent
  },
});
