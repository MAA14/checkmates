"use client";

import { useEffect, useState } from "react";
import { CheckCircle, LogIn, XCircle } from "lucide-react";
import { supabase } from "@/libs/supabase";
import BackgroundEffects from "@/components/molecules/BackgroundEffects";
import { useRouter } from "next/navigation";
import { routeUrl } from "@/utils/URouteUrl";
import { TToast, TToastType } from "@/components/types/TToast";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fakeEmail = `${username}@checkmates.local`;
      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });
      if (error) {
        showToast("Username atau password salah", "error");
        return;
      }
      showToast("Login berhasil", "success");
      setTimeout(() => router.push(routeUrl.dashboard), 2000);
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
          {/* Logo — ganti dari '+' ke LogIn icon */}
          <div className="w-20 h-20 bg-[#354e32] rounded-2xl flex items-center justify-center text-white mb-4">
            <LogIn size={36} />
          </div>

          <h1 className="text-4xl font-bold text-[#354e32]">Login</h1>
          <p className="text-gray-500 mt-2 text-center">
            Masuk ke akun SINIGAS
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#354e32]/40 focus:border-[#354e32]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#354e32]/40 focus:border-[#354e32]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#354e32] hover:bg-[#283b25] text-white font-semibold p-4 rounded-xl transition"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Belum punya akun?{" "}
          <Link
            href={routeUrl.register}
            className="text-[#354e32] font-semibold"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
