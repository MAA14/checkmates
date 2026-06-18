/**
 * Task Utilities
 * Common functions for task management and filtering
 */

import TTask from "@/components/types/TTask";

/**
 * Count unread notifications
 */
export function countUnread(rows: TTask[]): number {
  let readIds: Set<string>;
  try {
    readIds = new Set(
      JSON.parse(localStorage.getItem("checkmates_read_notifs") || "[]"),
    );
  } catch {
    readIds = new Set();
  }

  let count = 0;
  const { daysLeft } = require("./dateHelpers");

  rows.forEach((row) => {
    if (row.status === "selesai") return;

    const left = daysLeft(row.deadline_at);
    const score = Number(row.total_priority_score || 0);
    let id = null;

    if (left !== null && left < 0) id = `overdue-${row.id}`;
    else if (left !== null && left <= 1) id = `urgent-${row.id}`;
    else if (left !== null && left <= 3) id = `soon-${row.id}`;
    else if (score > 74) id = `priority-${row.id}`;

    if (id && !readIds.has(id)) count++;
  });

  return count;
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(notificationId: string): void {
  try {
    const readIds = new Set(
      JSON.parse(localStorage.getItem("checkmates_read_notifs") || "[]"),
    );
    readIds.add(notificationId);
    localStorage.setItem(
      "checkmates_read_notifs",
      JSON.stringify(Array.from(readIds)),
    );
  } catch {
    console.error("Failed to mark notification as read");
  }
}

/**
 * Get all read notification IDs
 */
export function getReadNotifications(): Set<string> {
  try {
    return new Set(
      JSON.parse(localStorage.getItem("checkmates_read_notifs") || "[]"),
    );
  } catch {
    return new Set();
  }
}
