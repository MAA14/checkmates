interface TStatCard {
  title: string;
  value: string | number;
  accent?: string;
  icon: React.ReactNode;
  hint?: string;
}
export default function StatCard({
  title,
  value,
  accent = "",
  icon,
  hint,
}: TStatCard) {
  return (
    <div className="stat-card glass-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3 className={accent}>{value}</h3>
        {hint && <span>{hint}</span>}
      </div>
    </div>
  );
}
