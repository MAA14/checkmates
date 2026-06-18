export interface TResult {
  semua: number;
  dalam_proses: number;
  selesai: number;
  terlambat: number;
}

export interface TResultLabels {
  semua: string;
  dalam_proses: string;
  selesai: string;
  terlambat: string;
}

export type TCategoryResult =
  | "semua"
  | "dalam_proses"
  | "selesai"
  | "terlambat";
