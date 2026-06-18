"use client";

import { useEffect, useState } from "react";
import { CheckCircle, UserPlus, XCircle } from "lucide-react";
import { supabase } from "@/libs/supabase";
import BackgroundEffects from "@/components/molecules/BackgroundEffects";
import { TToast, TToastType } from "@/components/types/TToast";
import { useRouter } from "next/navigation";
import { routeUrl } from "@/utils/URouteUrl";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<TToast | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function showToast(message: string, type: TToastType = "info") {
    setToast({ message, type });
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Konfirmasi password tidak sama", "error");
      return;
    }

    try {
      setLoading(true);
      const fakeEmail = `${formData.username}@checkmates.local`;
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: formData.password,
      });

      if (error) {
        showToast(error.message, "error");
        return;
      }

      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: user.id, username: formData.username });

        if (profileError) {
          console.error(profileError);
          showToast("Profile gagal dibuat", "error");
          return;
        }
      }

      showToast("Register berhasil", "success");
      setTimeout(() => router.push(routeUrl.login), 2000);
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <BackgroundEffects />

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" && <CheckCircle size={20} />}
          {toast.type === "error" && <XCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          {/* Logo — ganti dari '+' ke UserPlus icon */}
          <div className="w-20 h-20 bg-[#354e32] rounded-2xl flex items-center justify-center text-white mb-4">
            <UserPlus size={36} />
          </div>

          <h1 className="text-4xl font-bold text-[#354e32]">Daftar Akun</h1>
          <p className="text-gray-500 mt-2 text-center">Buat akun SINIGAS</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#354e32]/40 focus:border-[#354e32]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#354e32]/40 focus:border-[#354e32]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Konfirmasi Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Ulangi password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#354e32]/40 focus:border-[#354e32]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#354e32] hover:bg-[#283b25] text-white font-semibold p-4 rounded-xl transition"
          >
            {loading ? "Loading..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Sudah punya akun?{" "}
          <Link href={routeUrl.login} className="text-[#354e32] font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
