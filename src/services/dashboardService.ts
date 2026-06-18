/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

interface DashboardStats {
  total: number;
  urgent: number;
  lateAssignments: number;
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data?: {
    stats?: DashboardStats;
    tasks?: Array<{
      id: string;
      judul: string;
      status: string;
      deadline_at: string;
      total_priority_score: number;
      created_at: string;
    }>;
  };
}

/**
 * Fetch dashboard statistics and top priority tasks
 */
export async function fetchDashboardData(): Promise<DashboardResponse> {
  try {
    const response = await fetch("/api/dashboard/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: DashboardResponse = await response.json();

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
          : "Gagal mengambil data dashboard",
    };
  }
}

/**
 * Fetch all tasks with filters
 */
export async function fetchAllTasks(filters?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<DashboardResponse> {
  try {
    const query = new URLSearchParams();
    if (filters?.status) query.append("status", filters.status);
    if (filters?.priority) query.append("priority", filters.priority);
    if (filters?.search) query.append("search", filters.search);

    const response = await fetch(`/api/tasks?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: DashboardResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil data tasks",
    };
  }
}

/**
 * Fetch current user profile
 */
export async function fetchUserProfile(): Promise<{
  success: boolean;
  data?: { username: string; email: string };
  message?: string;
}> {
  try {
    const response = await fetch("/api/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil profil user",
    };
  }
}
