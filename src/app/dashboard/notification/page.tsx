"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCheck,
  Circle,
  Clock,
  PartyPopper,
  Siren,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { timeAgo } from "@/utils/dateHelpers";
import TTask from "@/components/types/TTask";
import TNotification from "./types/TNotification";
import { fetchNotifications } from "@/services/taskService";
import {
  markNotificationAsRead,
  getReadNotifications,
} from "@/utils/notificationHelpers";

interface NotificationData {
  id: string;
  type: "overdue" | "urgent" | "soon" | "priority";
  title: string;
  message: string;
  tag: string;
  date: string;
  isNew: boolean;
}

interface NotifCardProps {
  notif: NotificationData;
  isRead: boolean;
  onRead: (id: string) => void;
  icon: React.ReactNode;
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function getNotificationIcon(
  type: "overdue" | "urgent" | "soon" | "priority",
): React.ReactNode {
  switch (type) {
    case "overdue":
      return <Clock size={18} />;
    case "urgent":
      return <Siren size={18} />;
    case "soon":
      return <TriangleAlert size={18} />;
    case "priority":
      return <Circle size={18} className="fill-current" />;
    default:
      return null;
  }
}

function NotifCard({ notif, isRead, onRead, icon }: NotifCardProps) {
  const badgeKey =
    notif.type === "overdue"
      ? "terlambat"
      : notif.type === "urgent"
        ? "sangat-tinggi"
        : notif.type === "soon"
          ? "tinggi"
          : "sedang";
  return (
    <article
      onClick={() => onRead(notif.id)}
      className={`notification-card glass-card ${notif.type} ${isRead ? "read" : "unread"}`}
    >
      <button type="button" className="notification-main">
        <div className="notification-piece">{icon}</div>
        <div>
          <h3>
            {notif.title}
            {notif.isNew && !isRead && <span className="chip-new">BARU</span>}
          </h3>
          <p>{notif.message}</p>
          <span>{timeAgo(notif.date)}</span>
        </div>
      </button>

      <div className="item-side">
        <span className={`priority-badge priority-${badgeKey}`}>
          {notif.tag}
        </span>
        {!isRead && <span className="unread-dot" />}
      </div>
    </article>
  );
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`filter-chip ${active ? "active" : ""}`}
    >
      {label}
    </button>
  );
}

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "urgent", label: "Mendesak" },
  { key: "soon", label: "Segera" },
  { key: "overdue", label: "Terlambat" },
  { key: "priority", label: "Prioritas" },
];

export default function Notifikasi() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("semua");
  const [showFilter, setShowFilter] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() =>
    getReadNotifications(),
  );

  useEffect(() => {
    let alive = true;

    const load = async (): Promise<void> => {
      setLoading(true);
      const result = await fetchNotifications();

      if (!alive) return;

      if (result.success && result.data) {
        setNotifications(result.data as NotificationData[]);
      } else {
        setError(result.message || "Gagal mengambil notifikasi");
        setNotifications([]);
      }

      setLoading(false);
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "semua") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds],
  );

  const markRead = (id: string): void => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      markNotificationAsRead(id);
      return next;
    });
  };

  const markAllRead = (): void => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(new Set(allIds));
    allIds.forEach(markNotificationAsRead);
  };

  const todayNotifs = filtered.filter((n) => n.isNew);
  const olderNotifs = filtered.filter((n) => !n.isNew);

  return (
    <section className="page-transition">
      <div className="page-header">
        <div>
          <span className="eyebrow">♖ Alert Center</span>
          <h1>Notifikasi Anda</h1>
          <p>
            Kelola informasi penting, deadline mendesak, dan kegiatan prioritas.
          </p>
        </div>

        <div
          className="hero-actions"
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              type="button"
              className="primary-button"
            >
              <CheckCheck size={16} /> Tandai Semua Dibaca
            </button>
          )}
          <button
            onClick={() => setShowFilter((f) => !f)}
            type="button"
            className="ghost-button"
          >
            <SlidersHorizontal size={16} /> Filter
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="filter-chip-group">
          {FILTERS.map((f) => (
            <FilterChip
              key={f.key}
              label={f.label}
              active={activeFilter === f.key}
              onClick={() => setActiveFilter(f.key)}
            />
          ))}
        </div>
      )}

      {unreadCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            fontWeight: 850,
            color: "var(--green-dark)",
          }}
        >
          <span className="unread-dot" />
          <span>{unreadCount} notifikasi belum dibaca</span>
        </div>
      )}

      {loading && (
        <div className="state-card glass-card">Memuat notifikasi...</div>
      )}
      {!loading && error && (
        <div className="error-card glass-card">{error}</div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="state-card glass-card">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
              opacity: 0.6,
            }}
          >
            <PartyPopper size={42} />
          </div>
          <strong>Tidak ada notifikasi</strong>
          <p style={{ margin: "6px 0 0" }}>Semua kegiatan dalam kondisi baik</p>
        </div>
      )}

      {!loading && !error && todayNotifs.length > 0 && (
        <div className="section-gap">
          <span className="eyebrow">Hari Ini</span>
          <div className="stack" style={{ marginTop: 12 }}>
            {todayNotifs.map((n) => (
              <NotifCard
                key={n.id}
                notif={n}
                isRead={readIds.has(n.id)}
                onRead={markRead}
                icon={getNotificationIcon(n.type)}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && olderNotifs.length > 0 && (
        <div className="section-gap">
          <span className="eyebrow">Sebelumnya</span>
          <div className="stack" style={{ marginTop: 12 }}>
            {olderNotifs.map((n) => (
              <NotifCard
                key={n.id}
                notif={n}
                isRead={readIds.has(n.id)}
                onRead={markRead}
                icon={getNotificationIcon(n.type)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
