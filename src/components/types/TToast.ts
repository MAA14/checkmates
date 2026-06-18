export type TToastType = "success" | "error" | "info";
export interface TToast {
  message: string;
  type: TToastType;
}
