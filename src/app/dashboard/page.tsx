"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/libs/supabase";
import StatCard from "@/components/molecules/StatCard";
import TaskCard from "@/components/molecules/TaskCard";
import { daysLeft } from "@/utils/dateHelpers";
import { useRouter } from "next/navigation";
import { routeUrl } from "@/utils/URouteUrl";
import TTask from "@/components/types/TTask";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<TTask[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError("");

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        router.push(routeUrl.login);
        return;
      }

      const { data, error } = await supabase
        .from("view_priority_tasks")
        .select("*")
        .not("status", "eq", "selesai")
        .eq("user_id", user.id)
        .order("total_priority_score", { ascending: false, nullsFirst: false });

      if (!alive) return;

      if (error) {
        setError(error.message || "Gagal mengambil data dashboard");
        setRows([]);
      } else {
        setRows(data || []);
      }

      setLoading(false);
    };

    load();
    return () => {
      alive = false;
    };
  }, [router, rows.length]);

  const stats = useMemo(() => {
    const total = rows.length;
    const urgent = rows.filter(
      (row) => Number(row.total_priority_score || 0) > 85,
    ).length;
    const lateAssignments = rows.filter((row) => {
      const left = daysLeft(row["deadline_at"]);
      return left !== null && left < 0;
    }).length;

    return { total, urgent, lateAssignments };
  }, [rows]);

  const topPriorityRows = useMemo(
    () =>
      rows
        .slice()
        .sort(
          (a, b) =>
            Number(b.total_priority_score || 0) -
            Number(a.total_priority_score || 0),
        )
        .slice(0, 5),
    [rows],
  );

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
