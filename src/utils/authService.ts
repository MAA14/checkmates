/**
 * Auth Service - Handles all authentication-related API calls
 * This replaces the direct Supabase calls in components
 */

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user_id?: string;
  };
}

/**
 * Login user with username and password
 * @param credentials - Username and password
 * @returns Auth response with success status and message
 */
export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Terjadi kesalahan saat login",
    };
  }
}

/**
 * Register new user
 * @param credentials - Username, password, and password confirmation
 * @returns Auth response with success status and message
 */
export async function register(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat registrasi",
    };
  }
}

/**
 * Logout user
 * @returns Auth response with success status and message
 */
export async function logout(): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat logout",
    };
  }
}
