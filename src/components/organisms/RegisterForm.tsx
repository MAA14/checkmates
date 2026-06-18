import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { register } from "@/utils/authService";
import { useToast } from "@/hooks/useToast";
import { routeUrl } from "@/utils/URouteUrl";

/**
 * Organism: Register Form Component
 * Handles user registration with validation and error handling
 */
export default function RegisterForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = (): boolean => {
    const newErrors = { username: "", password: "", confirmPassword: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    setErrors(newErrors);
    return (
      !newErrors.username && !newErrors.password && !newErrors.confirmPassword
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await register(formData);

      if (response.success) {
        showToast("Registrasi berhasil", "success");
        setTimeout(() => router.push(routeUrl.login), 1500);
      } else {
        showToast(response.message, "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        helperText="Minimal 6 karakter"
        required
      />

      <Input
        type="password"
        name="confirmPassword"
        label="Konfirmasi Password"
        placeholder="Ulangi password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Loading..." : "Daftar Sekarang"}
      </Button>
    </form>
  );
}
