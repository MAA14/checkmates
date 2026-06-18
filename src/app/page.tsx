import { HomePage } from "@/components/pages/HomePage";
import { TFeature, TSteps } from "@/components/types/THomePage";

const features: TFeature[] = [
  {
    icon: "♙",
    title: "Deadline jadi value",
    text: "Sisa hari otomatis dihitung menjadi nilai prioritas agar kamu tahu mana yang harus dikerjakan dulu.",
  },
  {
    icon: "♘",
    title: "Notifikasi prioritas",
    text: "CheckMates memberi peringatan saat kegiatan masuk prioritas tinggi, sangat tinggi, atau terlambat.",
  },
  {
    icon: "♖",
    title: "Dashboard terarah",
    text: "Pantau total kegiatan, status terlambat, dan daftar kegiatan berdasarkan urutan prioritas.",
  },
  {
    icon: "♕",
    title: "Glassy chess UI",
    text: "Tampilan modern bertema catur dengan nuansa glassy, clean, dan responsive untuk mobile.",
  },
];

const steps: TSteps = [
  [
    "♙",
    "Input kegiatan",
    "Masukkan nama kegiatan, deadline, status, dan variabel prioritas.",
  ],
  [
    "♘",
    "Hitung otomatis",
    "Sistem menghitung skor prioritas berdasarkan data yang sudah kamu isi.",
  ],
  [
    "♖",
    "Urutkan prioritas",
    "Kegiatan ditampilkan dengan badge Rendah, Sedang, Tinggi, atau Sangat Tinggi.",
  ],
  [
    "♔",
    "Selesaikan tugas",
    "Kerjakan kegiatan paling penting lebih dulu sebelum deadline datang.",
  ],
];

export default function Home() {
  return <HomePage data={{ features, steps }} />;
}
