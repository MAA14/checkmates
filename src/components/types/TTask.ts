export default interface TTask {
  id: string;
  judul: string;
  deadline_at: string;
  status: "selesai" | "belum_selesai" | "terlambat";
  created_at: string;
  total_priority_score: number;
}
