"use client";

import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/molecules/StatCard";
import TaskCard from "@/components/molecules/TaskCard";
import { daysLeft } from "@/utils/dateHelpers";
import { useRouter } from "next/navigation";
import { routeUrl } from "@/utils/URouteUrl";
import TTask from "@/components/types/TTask";
import { fetchDashboardData } from "@/services/dashboardService";

interface DashboardStats {
  total: number;
  urgent: number;
  lateAssignments: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<TTask[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    urgent: 0,
    lateAssignments: 0,
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    const load = async (): Promise<void> => {
      setLoading(true);
      setError("");

      const result = await fetchDashboardData();
      if (!alive) return;

      if (result.success && result.data) {
        setStats(result.data.stats || stats);
        setRows((result.data.tasks || []) as TTask[]);
      } else {
        setError(result.message || "Gagal mengambil data dashboard");
        setRows([]);
      }

      setLoading(false);
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const topPriorityRows = useMemo(() => rows.slice(0, 5), [rows]);

  return (
    <section className="page-transition">
      <div className="grid-stats">
        <StatCard
          title="Total Kegiatan"
          value={stats.total}
          icon={<span className="chess-stat-icon chess-rook">♖</span>}
        />

        <StatCard
          title="Terlambat"
          value={stats.lateAssignments}
          icon={<span className="chess-stat-icon chess-knight">♘</span>}
        />

        <StatCard
          title="Prioritas Sangat Tinggi"
          value={stats.urgent}
          icon={<span className="chess-stat-icon chess-king">♔</span>}
        />
      </div>

      <div className="page-header row-header section-gap">
        <button
          onClick={() => router.push(routeUrl.tasks)}
          className="ghost-button"
          type="button"
        >
          Lihat Semua Tugas →
        </button>
      </div>

      <div className="stack">
        {loading && (
          <div className="state-card glass-card">Memuat data prioritas...</div>
        )}
        {!loading && error && (
          <div className="error-card glass-card">{error}</div>
        )}
        {!loading && !error && rows.length === 0 && (
          <div className="state-card glass-card">Belum ada tugas.</div>
        )}
        {!loading &&
          !error &&
          topPriorityRows.map((row) => (
            <TaskCard key={row.id} row={row} mode="priority" />
          ))}
      </div>
    </section>
  );
}
