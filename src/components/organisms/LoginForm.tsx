import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { login } from "@/utils/authService";
import { useToast } from "@/hooks/useToast";
import { routeUrl } from "@/utils/URouteUrl";
import { supabase } from "@/libs/supabase";

/**
 * Organism: Login Form Component
 * Handles user login with validation and error handling
 */
export default function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateForm = (): boolean => {
    const newErrors = { username: "", password: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password harus diisi";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fakeEmail = `${formData.username}@checkmates.local`;
      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: formData.password,
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
    <form onSubmit={handleLogin} className="space-y-5">
      <Input
        type="text"
        name="username"
        label="Username"
        placeholder="Masukkan username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
      />

      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="Masukkan password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Loading..." : "Masuk"}
      </Button>
    </form>
  );
}
