/**
 * Task Service
 * Handles all task-related API calls
 */

interface TaskResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Fetch task details by ID
 */
export async function fetchTaskDetails(taskId: string): Promise<TaskResponse> {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: TaskResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil detail task",
    };
  }
}

/**
 * Create new task
 */
export async function createTask(
  taskData: Record<string, unknown>,
): Promise<TaskResponse> {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    const data: TaskResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal membuat task baru",
    };
  }
}

/**
 * Update task
 */
export async function updateTask(
  taskId: string,
  taskData: Record<string, unknown>,
): Promise<TaskResponse> {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    const data: TaskResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengupdate task",
    };
  }
}

/**
 * Delete task
 */
export async function deleteTask(taskId: string): Promise<TaskResponse> {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: TaskResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus task",
    };
  }
}

/**
 * Fetch all tasks with optional filters
 */
export async function fetchAllTasks(filters?: {
  status?: string;
  priority?: string;
  search?: string;
}): Promise<TaskResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);

    const query = params.toString();
    const url = `/api/tasks${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: TaskResponse = await response.json();

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
 * Fetch analytics data
 */
export async function fetchAnalyticsData(): Promise<TaskResponse> {
  try {
    const response = await fetch("/api/analytics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: TaskResponse = await response.json();

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
          : "Gagal mengambil data analytics",
    };
  }
}

/**
 * Fetch notifications
 */
export async function fetchNotifications(): Promise<TaskResponse> {
  try {
    const response = await fetch("/api/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data: TaskResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal mengambil notifikasi",
    };
  }
}
