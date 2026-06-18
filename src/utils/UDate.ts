export default function daysLeft(deadline: string) {
  if (!deadline) return null;
  const d = new Date(deadline);
  const now = new Date();
  const diff = d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
