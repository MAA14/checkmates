"use client";

import { UserPlus } from "lucide-react";
import BackgroundEffects from "@/components/molecules/BackgroundEffects";
import Toast from "@/components/molecules/Toast";
import AuthHeader from "@/components/molecules/AuthHeader";
import AuthFooter from "@/components/molecules/AuthFooter";
import RegisterForm from "@/components/organisms/RegisterForm";
import { routeUrl } from "@/utils/URouteUrl";
import { useToast } from "@/hooks/useToast";

/**
 * Register Page
 * Displays registration form with background effects and toast notifications
 */
export default function RegisterPage() {
  const { toast } = useToast();

  return (
    <div className="auth-page">
      <BackgroundEffects />

      <Toast toast={toast} />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Auth Header with Icon */}
        <AuthHeader title="Daftar Akun" description="Buat akun SINIGAS">
          <UserPlus size={36} />
        </AuthHeader>

        {/* Register Form */}
        <RegisterForm />

        {/* Auth Footer with Login Link */}
        <AuthFooter
          text="Sudah punya akun?"
          linkText="Masuk di sini"
          href={routeUrl.login}
        />
      </div>
    </div>
  );
}
