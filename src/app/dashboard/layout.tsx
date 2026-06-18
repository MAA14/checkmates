"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, LogOut, Menu } from "lucide-react";
import BackgroundEffects from "../../components/molecules/BackgroundEffects";
import Link from "next/link";
import { ChessIcons } from "@/components/atoms/ChessIcons";
import TTask from "@/components/types/TTask";
import { usePathname, useRouter } from "next/navigation";
import { mascotSrc } from "@/utils/UImageSrc";
import { routeUrl } from "@/utils/URouteUrl";
import { fetchUserProfile } from "@/services/dashboardService";
import { countUnread } from "@/utils/notificationHelpers";
import { logout } from "@/utils/authService";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [rows, setRows] = useState<TTask[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadUserData = async (): Promise<void> => {
      setLoading(true);
      setAuthError(false);
      try {
        // Fetch user profile from backend
        const profileResult = await fetchUserProfile();

        if (!alive) return;

        if (profileResult.success && profileResult.data) {
          setUserName(profileResult.data.username || "User");
          setUserEmail(profileResult.data.email || "");
          setAuthError(false);
        } else {
          // If unauthorized, redirect to login
          if (profileResult.message === "Unauthorized") {
            setAuthError(true);
            router.push(routeUrl.login);
          } else {
            // For other errors, keep current state and retry
            console.error("Profile fetch error:", profileResult.message);
          }
        }
      } catch (error) {
        if (alive) {
          console.error("Error loading user data:", error);
          setAuthError(true);
          router.push(routeUrl.login);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadUserData();

    return () => {
      alive = false;
    };
  }, [router]);

  const unreadCount = useMemo(() => countUnread(rows), [rows]);

  const handleLogout = async (): Promise<void> => {
    const result = await logout();
    if (result.success) {
      router.push(routeUrl.login);
    }
  };

  const navItems = [
    {
      to: routeUrl.dashboard,
      label: "Dashboard",
      icon: ChessIcons("king"),
      end: true,
    },
    {
      to: routeUrl.task_create,
      label: "Input Kegiatan",
      icon: ChessIcons("pawn"),
    },
    {
      to: routeUrl.tasks,
      label: "Semua Kegiatan",
      icon: ChessIcons("rook"),
    },
    {
      to: routeUrl.notification,
      label: "Notifikasi",
      icon: ChessIcons("knight"),
      badge: unreadCount,
    },
    {
      to: routeUrl.analytics,
      label: "Dashboard Analitik",
      icon: ChessIcons("queen"),
    },
  ];

  return (
    <div className="app-shell">
      <BackgroundEffects />

      {!isMobileMenuOpen && (
        <button
          className="sidebar-float-toggle"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Buka menu"
          type="button"
        >
          <Menu size={22} />
        </button>
      )}

      {isMobileMenuOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Tutup menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar glass-card ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand-mini">
            <img src={mascotSrc} alt="CheckMates Mascot" />
            <div>
              <strong>CheckMates</strong>
              <small>Priority System</small>
            </div>
          </div>
        </div>

        <div className="user-pill">
          <div className="avatar-small">
            <CalendarCheck size={18} />
          </div>
          <div>
            <strong>{userName || "User"}</strong>
            <small>{userEmail}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon, end, badge }) => (
            <Link
              key={to}
              href={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname === to ? "active" : ""}
            >
              <span>
                {icon}
                {label}
              </span>
              {badge && badge > 0 && <b>{badge > 9 ? "9+" : badge}</b>}
            </Link>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout} type="button">
          <LogOut size={19} /> Keluar
        </button>
      </aside>

      <div className="app-content">
        <header className="topbar glass-card">
          <div className="topbar-left">
            <div>
              <p className="topbar-title">CheckMates</p>
              <p className="topbar-greeting">
                Selamat datang kembali, {userName}
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="user-pill">
              <div>
                <strong>{userName}</strong>
                <small>{userEmail}</small>
              </div>
              <div className="avatar-small">
                {String(userName || "U")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
