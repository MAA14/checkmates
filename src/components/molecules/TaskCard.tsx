"use client";

import { useRouter } from "next/navigation";
import { useMemo, ReactNode } from "react";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import TTask from "@/components/types/TTask";
import { daysLeft, formatDate } from "@/utils/dateHelpers";
import { getCategory } from "@/utils/taskHelpers";
import { getPriorityClass } from "@/utils/priorityHelpers";
import { routeUrl } from "@/utils/URouteUrl";

// ============================================================================
// Type Definitions
// ============================================================================

type TaskMode = "kegiatan" | "priority";
type TaskCategory = "selesai" | "terlambat" | "dalam_proses";
type PriorityLabel = "SANGAT TINGGI" | "TINGGI" | "SEDANG" | "RENDAH";

interface TaskCardProps {
  /** Task data object */
  row: TTask;
  /** Display mode: 'kegiatan' or 'priority' */
  mode?: TaskMode;
  /** Show deadline information */
  showDeadline?: boolean;
  /** Show status badge */
  showStatus?: boolean;
  /** Show days remaining box */
  showDayBox?: boolean;
  /** Enable click interactions */
  clickable?: boolean;
  /** Optional custom click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

interface BadgeDisplay {
  label: string;
  key: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts a priority label to a CSS-friendly class key
 * @param label - The priority label (e.g., "SANGAT TINGGI")
 * @returns Hyphenated lowercase string (e.g., "sangat-tinggi")
 */
function priorityKeyGenerator(label: string): string {
  return String(label || "rendah")
    .toLowerCase()
    .replaceAll(" ", "-");
}

/**
 * Determines the badge display text and CSS key based on task category and mode
 * @param category - Task category
 * @param priorityClass - Priority classification
 * @param mode - Display mode
 * @returns Badge label and key for styling
 */
function getBadgeDisplay(
  category: TaskCategory,
  priorityClass: PriorityLabel,
  mode: TaskMode,
): BadgeDisplay {
  let label = priorityClass;
  let key = priorityKeyGenerator(priorityClass);

  // Override badge for non-priority mode
  if (mode !== "priority") {
    if (category === "selesai") {
      return { label: "SELESAI", key: "selesai" };
    }
    if (category === "terlambat") {
      return { label: "TERLAMBAT", key: "terlambat" };
    }
  }

  return { label, key };
}

/**
 * Determines the display icon based on task category and mode
 * @param category - Task category
 * @param isPriorityMode - Whether in priority mode
 * @returns Icon string
 */
function getDisplayIcon(
  category: TaskCategory,
  isPriorityMode: boolean,
): string {
  return category === "selesai" && !isPriorityMode ? "✓" : "♞";
}

/**
 * Builds the CSS class string for the card
 * @param isPriorityMode - Whether in priority mode
 * @param category - Task category
 * @returns CSS class string
 */
function buildCardClass(
  isPriorityMode: boolean,
  category: TaskCategory,
): string {
  const classes = ["item-card", "glass-card"];
  if (isPriorityMode) classes.push("featured");
  classes.push(category);
  return classes.join(" ");
}

/**
 * Determines the display box class based on category and priority
 * @param category - Task category
 * @param badgeKey - Badge key
 * @returns CSS class for daybox
 */
function getDayboxClass(category: TaskCategory, badgeKey: string): string {
  const categoryKey =
    category === "selesai"
      ? "selesai"
      : category === "terlambat"
        ? "terlambat"
        : badgeKey;
  return `task-daybox priority-${categoryKey}`;
}

/**
 * Formats the remaining days display
 * @param daysRemaining - Number of days remaining (can be negative)
 * @returns Object with amount and label
 */
function formatDaysDisplay(daysRemaining: number | null): {
  amount: ReactNode;
  label: string;
} {
  if (daysRemaining === null) {
    return { amount: "?", label: "hari" };
  }
  return {
    amount: Math.abs(daysRemaining),
    label: daysRemaining < 0 ? "terlambat" : "hari",
  };
}

// ============================================================================
// Component
// ============================================================================

/**
 * TaskCard - Displays a task/kegiatan in card format
 *
 * @component
 * @example
 * ```tsx
 * <TaskCard
 *   row={taskData}
 *   mode="kegiatan"
 *   clickable={true}
 * />
 * ```
 */
export default function TaskCard({
  row,
  mode = "kegiatan",
  showDeadline = true,
  showStatus = true,
  showDayBox = true,
  clickable = true,
  onClick,
}: TaskCardProps) {
  const router = useRouter();

  // Memoize computed values for performance
  const computedValues = useMemo(() => {
    const title = row?.judul || "";
    const deadline = row?.deadline_at;
    const priorityScore = Number(row?.total_priority_score || 0);
    const category = getCategory(row) as TaskCategory;
    const priorityClass = getPriorityClass(priorityScore) as PriorityLabel;
    const daysRemaining = daysLeft(deadline);
    const isPriorityMode = mode === "priority";

    const badge = getBadgeDisplay(category, priorityClass, mode);
    const icon = getDisplayIcon(category, isPriorityMode);
    const cardClass = buildCardClass(isPriorityMode, category);
    const dayboxClass = getDayboxClass(category, badge.key);
    const daysDisplay = formatDaysDisplay(daysRemaining);

    return {
      title,
      deadline,
      category,
      isPriorityMode,
      badge,
      icon,
      cardClass,
      dayboxClass,
      daysRemaining,
      daysDisplay,
    };
  }, [row, mode]);

  // Handle card click
  const handleClick = (e: React.MouseEvent<HTMLElement>): void => {
    if (!clickable) return;
    if (onClick) {
      onClick(e);
    } else if (row?.id) {
      router.push(`${routeUrl.task_details}/${row.id}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (clickable && e.key === "Enter") {
      handleClick(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const {
    title,
    deadline,
    badge,
    icon,
    cardClass,
    dayboxClass,
    daysRemaining,
    isPriorityMode,
    daysDisplay,
    category,
  } = computedValues;

  return (
    <article
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      className={cardClass}
    >
      <button className="item-main" type="button" tabIndex={-1}>
        {/* Chess Icon */}
        <div className="item-chess">{icon}</div>

        {/* Task Information */}
        <div className="item-info">
          <span className="eyebrow">
            {isPriorityMode ? "Prioritas" : "Kegiatan"}
          </span>

          {/* Status Badge */}
          {showStatus && (
            <span className={`priority-badge priority-${badge.key}`}>
              {badge.label}
            </span>
          )}

          {/* Task Title */}
          <h3>{title}</h3>

          {/* Deadline */}
          {showDeadline && (
            <div className="item-meta">
              <span>
                {isPriorityMode ? (
                  <CalendarDays size={18} />
                ) : (
                  <Calendar size={15} />
                )}
                Deadline: {formatDate(deadline, "short")}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Side Section */}
      <div className="item-side">
        {/* Days Remaining Box */}
        {showDayBox && (
          <div className={dayboxClass}>
            {category === "selesai" && !isPriorityMode ? (
              <>
                <CheckCircle2 size={28} strokeWidth={2.6} />
                <small>selesai</small>
              </>
            ) : (
              <>
                <strong>{daysDisplay.amount}</strong>
                <small>{daysDisplay.label}</small>
              </>
            )}
          </div>
        )}

        {/* Chevron Icon */}
        {!isPriorityMode && <ChevronRight size={18} className="chevron" />}
      </div>
    </article>
  );
}
